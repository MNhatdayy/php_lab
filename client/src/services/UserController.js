import axios from "axios";
export const fetchUsers = async (setUsers, setLoading, message) => {
    try {
        const response = await axios.get(
            "http://localhost:81/php_lab/api/users"
        );
        // const response = await axios.get('http://localhost:82/php_lab/api/users');
        setUsers(response.data);
        setLoading(false);
    } catch (error) {
        message.error("Failed to fetch users");
        setLoading(false); // Add this line to stop the loading spinner on error
    }
};
export const deleteUser = async (id, message) => {
    try {
        await axios.delete(`http://localhost:81/php_lab/api/users/${id}`);
        // await axios.delete(`http://localhost:82/php_lab/api/users/${id}`);
        message.success("User deleted successfully");
    } catch (error) {
        message.error("Failed to delete user");
    }
};
