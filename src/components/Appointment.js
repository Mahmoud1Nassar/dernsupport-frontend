import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from './Authenication/utils';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Container, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({ appointmentDate: '', location: '', userPhone: '' });
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    // Function to fetch appointments based on role
    const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);

        if (decodedToken) {
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            setRole(userRole);
            const currentUserId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            setUserId(currentUserId);

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/Appointment`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (userRole === 'Admin') {
                    setAppointments(response.data);
                } else if (userRole === 'Customer') {
                    const customerAppointments = response.data.filter(app => app.userId === currentUserId);
                    setAppointments(customerAppointments);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

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
            setNewAppointment({ appointmentDate: '', location: '', userPhone: '' });
            setOpenDialog(false);
            fetchAppointments();
        } catch (error) {
            console.error('Error creating appointment:', error.response || error);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/Appointment/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAppointments();
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Appointments
                    </Typography>

                    {/* Scrollable table with better spacing */}
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                                            <TableCell>{appointment.appointmentDate.split('T')[0]}</TableCell>
                                            <TableCell>{appointment.location}</TableCell>
                                            {role === 'Admin' && <TableCell>{appointment.userName}</TableCell>}
                                            {role === 'Admin' && (
                                                <TableCell>
                                                    <IconButton color="secondary" onClick={() => handleDeleteAppointment(appointment.appointmentId)}>
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Paper>
                </Grid>

                {(role === 'Admin' || role === 'Customer') && (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
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
