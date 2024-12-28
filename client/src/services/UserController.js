import axios from "axios";
export const fetchUsers = async (setUsers,setLoading,message) =>{
    try {
        const response = await axios.get('http://localhost:8099/api/users');
        setUsers(response.data);
        setLoading(false);
    } catch (error) {
        message.error('Failed to fetch users');
        setLoading(false); // Add this line to stop the loading spinner on error
    }
}
export const deleteUser = async (id,message) =>{
    try {
        await axios.delete(`http://localhost:8099/api/users/${id}`);
        message.success('User deleted successfully');
      } catch (error) {
        message.error('Failed to delete user');
      }
}
