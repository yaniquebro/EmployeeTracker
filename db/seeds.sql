INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Education');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Lead', 100000, 1),
        ('Teacher', 55000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, NULL),
        ('Mikael', 'Cosbey', 1, 1),
        ('Ashley', 'Rodriguez', 2, NULL),
        ('Kayla', 'Rodney', 2, 3)