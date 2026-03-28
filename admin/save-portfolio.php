<?php
session_start();
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

header('Content-Type: application/json');

// Simple file-based storage for demo (should use DB in production)
$dataFile = __DIR__ . '/portfolio-data.json';
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}
$data = json_decode(file_get_contents($dataFile), true);
if (!is_array($data)) {
    $data = [];
}

function normalize_path_for_json($path) {
    return str_replace('\\', '/', $path);
}

function upload_file_if_exists($fileField, $targetDir, $targetPrefix) {
    if (!isset($_FILES[$fileField]) || !isset($_FILES[$fileField]['error'])) {
        return null;
    }

    if ($_FILES[$fileField]['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $ext = strtolower(pathinfo($_FILES[$fileField]['name'], PATHINFO_EXTENSION));
    $safeExt = preg_replace('/[^a-z0-9]/', '', $ext);
    $filename = $targetPrefix . '_' . time() . '_' . mt_rand(1000, 9999);
    if ($safeExt !== '') {
        $filename .= '.' . $safeExt;
    }

    $target = rtrim($targetDir, '/\\') . '/' . $filename;
    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0777, true);
    }

    if (move_uploaded_file($_FILES[$fileField]['tmp_name'], $target)) {
        return normalize_path_for_json($target);
    }

    return null;
}

$section = $_POST['section'] ?? '';

switch ($section) {
    case 'hero':
        $data['hero'] = array_merge($data['hero'] ?? [], [
            'name' => $_POST['name'] ?? '',
            'role' => $_POST['role'] ?? '',
            'department' => $_POST['department'] ?? '',
            'employee_id' => $_POST['employee_id'] ?? '',
        ]);
        // Handle profile image upload
        $uploadedProfile = upload_file_if_exists('profile_image', '../assets/images', 'profile_admin');
        if ($uploadedProfile !== null) {
            $data['hero']['profile_image'] = $uploadedProfile;
        }
        break;
    case 'about':
        $data['about'] = [
            'about' => $_POST['about'] ?? ''
        ];
        break;
    case 'skills':
        $data['skills'] = [
            'skills' => $_POST['skills'] ?? ''
        ];
        break;
    case 'projects':
    case 'add_project':
        if (!isset($data['projects']) || !is_array($data['projects'])) {
            $data['projects'] = [];
        }

        $project = [
            'title' => $_POST['project_title'] ?? '',
            'icon' => $_POST['project_icon'] ?? '',
            'desc' => $_POST['project_desc'] ?? ($_POST['project_description'] ?? ''),
            'technologies' => $_POST['project_technologies'] ?? ''
        ];

        if (trim($project['title']) === '' && trim($project['desc']) === '') {
            echo json_encode(['success' => false, 'message' => 'Judul/deskripsi project wajib diisi']);
            exit();
        }

        // Handle project media upload
        $uploadedProjectMedia = upload_file_if_exists('project_media', '../assets/images', 'project');
        if ($uploadedProjectMedia !== null) {
            $project['media'] = $uploadedProjectMedia;
        }

        $data['projects'][] = $project;
        break;
    case 'experience':
        $periods = $_POST['exp_period'] ?? [];
        $titles = $_POST['exp_title'] ?? [];
        $places = $_POST['exp_place'] ?? [];
        $descs = $_POST['exp_desc'] ?? [];

        $experienceItems = [];
        $maxExp = max(count($periods), count($titles), count($places), count($descs));
        for ($i = 0; $i < $maxExp; $i++) {
            $item = [
                'period' => trim($periods[$i] ?? ''),
                'title' => trim($titles[$i] ?? ''),
                'place' => trim($places[$i] ?? ''),
                'desc' => trim($descs[$i] ?? '')
            ];

            if ($item['period'] !== '' || $item['title'] !== '' || $item['place'] !== '' || $item['desc'] !== '') {
                $experienceItems[] = $item;
            }
        }

        $data['experience'] = [
            'items' => $experienceItems,
            'experiences' => implode(', ', array_map(function ($item) {
                return $item['title'];
            }, $experienceItems))
        ];
        break;
    case 'certificates':
        $titles = $_POST['certificate_title'] ?? [];
        $issuers = $_POST['certificate_issuer'] ?? [];
        $dates = $_POST['certificate_date'] ?? [];

        if (!is_array($titles)) {
            $titles = [$titles];
        }
        if (!is_array($issuers)) {
            $issuers = [$issuers];
        }
        if (!is_array($dates)) {
            $dates = [$dates];
        }

        $certificates = [];
        $maxCert = max(count($titles), count($issuers), count($dates));
        for ($i = 0; $i < $maxCert; $i++) {
            $certificate = [
                'title' => trim($titles[$i] ?? ''),
                'issuer' => trim($issuers[$i] ?? ''),
                'date' => trim($dates[$i] ?? '')
            ];

            $existingFile = $data['certificates'][$i]['file'] ?? null;

            if (isset($_FILES['certificate_file']['error'][$i]) && $_FILES['certificate_file']['error'][$i] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($_FILES['certificate_file']['name'][$i], PATHINFO_EXTENSION));
                $safeExt = preg_replace('/[^a-z0-9]/', '', $ext);
                $target = '../assets/cv/certificate_' . time() . '_' . $i . '_' . mt_rand(1000, 9999);
                if ($safeExt !== '') {
                    $target .= '.' . $safeExt;
                }
                if (@move_uploaded_file($_FILES['certificate_file']['tmp_name'][$i], $target)) {
                    $certificate['file'] = normalize_path_for_json($target);
                } elseif ($existingFile) {
                    $certificate['file'] = $existingFile;
                }
            } elseif ($existingFile) {
                $certificate['file'] = $existingFile;
            }

            if ($certificate['title'] !== '' || $certificate['issuer'] !== '' || $certificate['date'] !== '' || isset($certificate['file'])) {
                $certificates[] = $certificate;
            }
        }

        $data['certificates'] = $certificates;
        break;
    case 'add_skill':
        $newSkill = trim($_POST['skill_name'] ?? '');
        if ($newSkill === '') {
            echo json_encode(['success' => false, 'message' => 'Nama skill wajib diisi']);
            exit();
        }

        $currentSkills = $data['skills']['skills'] ?? '';
        $skillsArr = array_filter(array_map('trim', explode(',', $currentSkills)));
        $skillsArr[] = $newSkill;
        $skillsArr = array_values(array_unique($skillsArr));
        $data['skills'] = [
            'skills' => implode(', ', $skillsArr)
        ];
        break;
    case 'contact':
        $data['contact'] = [
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'github' => $_POST['github'] ?? '',
            'instagram' => $_POST['instagram'] ?? ''
        ];
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Section not found']);
        exit();
}

file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
echo json_encode(['success' => true, 'message' => 'Perubahan berhasil disimpan!']);
