# PHP Native CRUD Web Portfolio

![Portfolio Preview](assets/images/landing%20page.png)

This project is a native PHP portfolio web application featuring simple CRUD (Create, Read, Update, Delete) functionality. The application is designed to display professional information such as profiles, skills, projects, experience, certificates, and contact details, complete with an independent content management system via an admin panel.

## Main Features

* **Public Portfolio Page:** A responsive frontend interface to showcase professional profiles.
* **Theme Customization:** Full support for toggling between Dark Mode and Light Mode.
* **Admin Panel:** An authenticated dashboard specifically for managing portfolio content.
* **Data Management (CRUD):** Dynamic functionality to add, read, update, and delete portfolio data.

## How to Run

Since this application relies on a PHP backend, a local web server such as XAMPP is required.

1. Save or move this project folder into the `htdocs` directory of your XAMPP installation.
2. Open the XAMPP Control Panel and start the Apache module.
3. Open your web browser and access the public interface via:
   `http://localhost/web-portofolio/web-portofolio/`
4. To access the Admin management panel, click the gear icon on the main portfolio page, or access the following link directly:
   `http://localhost/web-portofolio/web-portofolio/admin/login.php`

## Important Notes

* If the application is opened using extensions like Live Server in VS Code (which typically runs on port 5500), the PHP scripts will not be executed.
* Ensure you always use an Apache environment (such as XAMPP) to test the Admin and CRUD features so the application functions as intended.

---
*This project was developed for self-learning purposes and to practice the fundamentals of dynamic web development using native PHP.*