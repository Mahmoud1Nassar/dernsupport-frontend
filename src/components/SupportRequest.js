import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from './Authenication/utils';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, TextField, Container, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon

const SupportRequest = () => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ issueType: '', description: '', requestDate: '' });
    const [editRequest, setEditRequest] = useState({ supportRequestId: '', issueType: '', description: '', requestDate: '' });
    const [role, setRole] = useState('');
    const [userId, setUserId] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // State for create pop-up form
    const [openEditDialog, setOpenEditDialog] = useState(false); // State for edit pop-up form

    // Function to fetch support requests
    const fetchSupportRequests = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);

        if (decodedToken) {
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            setRole(userRole);
            const currentUserId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            setUserId(currentUserId);

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/SupportRequest`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (userRole === 'Customer') {
                    // Filter support requests by userId for customers
                    const customerSupportRequests = response.data.filter(request => request.userId === currentUserId);
                    setSupportRequests(customerSupportRequests);
                } else {
                    // Admins and Technicians can see all support requests
                    setSupportRequests(response.data);
                }
            } catch (error) {
                console.error('Error fetching support requests:', error);
            }
        }
    };

    // Fetch support requests when component mounts
    useEffect(() => {
        fetchSupportRequests();
    }, []);

    // Function to handle support request creation
    const handleCreateSupportRequest = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);
        const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/SupportRequest`,
                {
                    issueType: newRequest.issueType,
                    description: newRequest.description,
                    requestDate: new Date().toISOString(),
                    userId: userId  // Ensure userId is passed correctly
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}` }
                }
            );
            // Clear the input fields after successful creation
            setNewRequest({ issueType: '', description: '', requestDate: '' });
            setOpenDialog(false); // Close the create form
            fetchSupportRequests(); // Fetch updated support requests
        } catch (error) {
            console.error('Error creating support request:', error.response || error);
        }
    };

    // Function to handle support request updates
    const handleUpdateSupportRequest = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/SupportRequest/${editRequest.supportRequestId}`,
                {
                    supportRequestId: editRequest.supportRequestId,
                    issueType: editRequest.issueType,
                    description: editRequest.description,
                    requestDate: editRequest.requestDate,
                    userId: editRequest.userId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOpenEditDialog(false); // Close the edit form
            fetchSupportRequests(); // Fetch updated support requests
        } catch (error) {
            console.error('Error updating support request:', error);
        }
    };

    // Function to handle support request deletion
    const handleDeleteSupportRequest = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/SupportRequest/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSupportRequests(); // Fetch updated support requests after deletion
        } catch (error) {
            console.error('Error deleting support request:', error);
        }
    };

    // Open the edit dialog and populate fields with existing data
    const openEditForm = (supportRequest) => {
        setEditRequest(supportRequest);
        setOpenEditDialog(true);
    };

    return (
        <Container>
            <Grid container spacing={3}>
                {/* Reduce the margin-top of the heading to make it closer to the table */}
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                    <h1>Support Requests</h1>
                    {/* Adding a container around the table with a max-height, scroll, and a wider width */}
                    <Box sx={{ maxHeight: '280px', overflowY: 'auto', width: '100%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Issue Type</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Date</TableCell>
                                    {(role === 'Admin' || role === 'Technician') && <TableCell>User</TableCell>}
                                    {(role === 'Admin' || role === 'Technician') && <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {supportRequests.map((supportRequest) => (
                                    <TableRow key={supportRequest.supportRequestId}>
                                        <TableCell>{supportRequest.supportRequestId}</TableCell>
                                        <TableCell>{supportRequest.issueType}</TableCell>
                                        <TableCell>{supportRequest.description}</TableCell>
                                        <TableCell>{supportRequest.requestDate.split('T')[0]}</TableCell> {/* Shows year-month-day */}
                                        {(role === 'Admin' || role === 'Technician') && (
                                            <TableCell>{supportRequest.userEmail ? supportRequest.userEmail : 'No Email'}</TableCell>
                                        )}
                                        {(role === 'Admin' || role === 'Technician') && (
                                            <TableCell>
                                                <IconButton color="primary" onClick={() => openEditForm(supportRequest)}>
                                                    <EditIcon />
                                                </IconButton>
                                                {(role === 'Admin' || role === 'Technician') && (
                                                    <IconButton color="secondary" onClick={() => handleDeleteSupportRequest(supportRequest.supportRequestId)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Grid>

                {/* Create button below the table */}
                {(role === 'Admin' || role === 'Customer' || role === 'Technician') && (
                    <Grid item xs={12} style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}  // Ensure it's visible
                            onClick={() => setOpenDialog(true)}
                        >
                            Create Support Request
                        </Button>
                    </Grid>
                )}
            </Grid>

            {/* Create support request pop-up form */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create Support Request</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Issue Type"
                        fullWidth
                        value={newRequest.issueType}
                        onChange={(e) => setNewRequest({ ...newRequest, issueType: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSupportRequest} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit support request pop-up form */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Support Request</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Issue Type"
                        fullWidth
                        value={editRequest.issueType}
                        onChange={(e) => setEditRequest({ ...editRequest, issueType: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={editRequest.description}
                        onChange={(e) => setEditRequest({ ...editRequest, description: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSupportRequest} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SupportRequest;
