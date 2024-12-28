<?php
class SessionHelper
{
    public static function isLoggedIn()
    {
        return isset($_SESSION['username']);
    }
    public static function isAdmin()
    {
        return isset($_SESSION['role_id']) && strtolower($_SESSION['role_id']) === '1';
        
    }
    // public static function isAdmin() {
    //     return isset($_SESSION['roles']) && in_array('1', $_SESSION['roles']);
    // }
    // public static function hasRole($role) {
    //     return isset($_SESSION['roles']) && in_array(strtolower($role), $_SESSION['roles']);
    // }
    
    public static function requireRole($role)
    {
        if (!isset($_SESSION['role']) || strtolower($_SESSION['role']) !== strtolower($role)) {
            echo "Expected role: " . strtolower($role) . "<br>";
            echo "Actual role: " . strtolower($_SESSION['role'] ?? 'None') . "<br>";
            die("Access denied: insufficient permissions");
        }
    }
}
