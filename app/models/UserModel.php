<?php
class UserModel
{
    private $conn;
    private $table_name = "user";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getUsers()
    {
        $query = "SELECT id, name, email, phone, role FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }

    public function getUserById($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        return $result;
    }

    public function addUser($name, $email, $password, $phone, $role)
    {
        $errors = [];
        if (empty($name)) {
            $errors['name'] = 'Tên người dùng không được để trống';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email không hợp lệ';
        }
        if (empty($password)) {
            $errors['password'] = 'Mật khẩu không được để trống';
        }
        if (count($errors) > 0) {
            return $errors;
        }

        $query = "INSERT INTO " . $this->table_name . " (name, email, password, phone, role) 
                  VALUES (:name, :email, :password, :phone, :role)";
        $stmt = $this->conn->prepare($query);

        $name = htmlspecialchars(strip_tags($name));
        $email = htmlspecialchars(strip_tags($email));
        $password = password_hash($password, PASSWORD_BCRYPT);
        $phone = htmlspecialchars(strip_tags($phone));
        $role = htmlspecialchars(strip_tags($role));

        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':role', $role);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateUser($id, $name, $email, $password, $phone, $role)
    {
        if (!is_numeric($id)) {
            throw new Exception('Invalid user ID');
        }

        $query = "UPDATE " . $this->table_name . " 
                  SET name=:name, email=:email, password=:password, phone=:phone, role=:role 
                  WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $name = htmlspecialchars(strip_tags($name));
        $email = htmlspecialchars(strip_tags($email));
        $password = password_hash($password, PASSWORD_BCRYPT);
        $phone = htmlspecialchars(strip_tags($phone));
        $role = htmlspecialchars(strip_tags($role));

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':role', $role);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function deleteUser($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
    public function getUserByEmail($email)
    {
        // SQL query to fetch the user by email
        $query = "SELECT * FROM user WHERE email = :email LIMIT 1";

        // Prepare the statement
        $stmt = $this->conn->prepare($query);

        // Bind the email parameter to the query
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);

        // Execute the query
        $stmt->execute();

        // Check if a user is found
        if ($stmt->rowCount() > 0) {
            // Fetch the user data
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            // Return null if no user is found
            return null;
        }
    }
}
