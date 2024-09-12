import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from './Authenication/utils';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Container, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({ appointmentDate: '', location: '', userPhone: '' });
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // State for pop-up form

    // Function to fetch appointments based on role
    const fetchAppointments = async () => {
        console.log('Fetching appointments...'); // Add logging to trace the fetch
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);

        if (decodedToken) {
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            setRole(userRole);
            const currentUserId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            setUserId(currentUserId);  // Use the actual UserId

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/Appointment`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (userRole === 'Admin') {
                    // Admin fetches all appointments
                    setAppointments(response.data);
                    console.log('Appointments fetched for Admin:', response.data);
                } else if (userRole === 'Customer') {
                    // Customer fetches only their own appointments by filtering with userId
                    const customerAppointments = response.data.filter(app => app.userId === currentUserId);
                    setAppointments(customerAppointments);
                    console.log('Appointments fetched for Customer:', customerAppointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        }
    };

    // Ensure the function is called when the component mounts
    useEffect(() => {
        console.log('Component mounted, fetching appointments...');
        fetchAppointments();
    }, []);  // Only run once when the component mounts

    // Function to handle appointment creation
    const handleCreateAppointment = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);
        const currentUserId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/Appointment`,
                {
                    appointmentDate: newAppointment.appointmentDate,
                    location: newAppointment.location,
                    userId: currentUserId,
                    userPhone: newAppointment.userPhone
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // Clear the input fields after successful creation
            setNewAppointment({ appointmentDate: '', location: '', userPhone: '' });
            setOpenDialog(false); // Close the pop-up after creation
            fetchAppointments(); // Fetch updated appointments
        } catch (error) {
            console.error('Error creating appointment:', error.response || error);
        }
    };

    // Function to handle appointment deletion
    const handleDeleteAppointment = async (appointmentId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/Appointment/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAppointments(); // Fetch updated appointments after deletion
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <Container>
            <Grid container spacing={3}>
                {/* Adjust margin-top to reduce space above heading */}
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                    <h1>Appointments</h1>
                    {/* Adding scrollable table container */}
                    <Box sx={{ maxHeight: '280px', overflowY: 'auto', width: '100%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Location</TableCell>
                                    {role === 'Admin' && <TableCell>User Name</TableCell>}
                                    {role === 'Admin' && <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment.appointmentId}>
                                        <TableCell>{appointment.appointmentId}</TableCell>
                                        <TableCell>{appointment.appointmentDate.split('T')[0]}</TableCell> {/* Shows year-month-day */}
                                        <TableCell>{appointment.location}</TableCell>
                                        {role === 'Admin' && <TableCell>{appointment.userName}</TableCell>}
                                        {role === 'Admin' && (
                                            <TableCell>
                                                <IconButton color="secondary" onClick={() => handleDeleteAppointment(appointment.appointmentId)}>
                                                    <DeleteIcon style={{ color: 'red' }} />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Grid>

                {/* Create button below the table */}
                {(role === 'Admin' || role === 'Customer') && (
                    <Grid item xs={12} style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }} // Ensure button stays visible
                            onClick={() => setOpenDialog(true)}
                        >
                            Create Appointment
                        </Button>
                    </Grid>
                )}
            </Grid>

            {/* Pop-up form */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Appointment Date"
                        type="datetime-local"
                        fullWidth
                        value={newAppointment.appointmentDate}
                        onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <TextField
                        label="Location"
                        fullWidth
                        value={newAppointment.location}
                        onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Phone Number"
                        fullWidth
                        value={newAppointment.userPhone}
                        onChange={(e) => setNewAppointment({ ...newAppointment, userPhone: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateAppointment} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Appointment;
