import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from './Authenication/utils'; // Assuming you have this utility for token parsing
import {
    Container, Grid, Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField, MenuItem, Select, InputLabel, FormControl, Table, TableHead, TableRow, TableBody, TableCell, IconButton, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // For editing spare parts

const SparePart = () => {
    const [spareParts, setSpareParts] = useState([]);
    const [selectedSparePart, setSelectedSparePart] = useState(''); // For adding new spare part
    const [editSparePart, setEditSparePart] = useState({}); // For editing existing spare part
    const [newSparePart, setNewSparePart] = useState({ stockLevel: '', cost: '' });
    const [role, setRole] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // State for add pop-up form
    const [openEditDialog, setOpenEditDialog] = useState(false); // State for edit pop-up form

    // Hardcoded list of computer spare parts
    const computerSpareParts = [
        { id: 1, name: 'CPU' },
        { id: 2, name: 'RAM' },
        { id: 3, name: 'Motherboard' },
        { id: 4, name: 'GPU' },
        { id: 5, name: 'Hard Drive' },
        { id: 6, name: 'Power Supply' },
        { id: 7, name: 'Cooling Fan' },
        { id: 8, name: 'Case' },
        { id: 9, name: 'Keyboard' },
        { id: 10, name: 'Mouse' }
    ];

    // Fetch spare parts from backend when the component mounts
    const fetchSpareParts = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token);

        if (decodedToken) {
            const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            setRole(userRole);

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/SparePart`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSpareParts(response.data); // Populate the list of spare parts
            } catch (error) {
                console.error('Error fetching spare parts:', error);
            }
        }
    };

    // Fetch spare parts on component mount
    useEffect(() => {
        fetchSpareParts();
    }, []);

    // Handle spare part selection from the dropdown for adding new part
    const handleSparePartSelect = (event) => {
        setSelectedSparePart(event.target.value);
    };

    // Handle spare part creation (Admin only)
    const handleCreateSparePart = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/SparePart`,
                {
                    name: selectedSparePart,
                    stockLevel: newSparePart.stockLevel,
                    cost: newSparePart.cost,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // Clear input fields after successful creation
            setNewSparePart({ stockLevel: '', cost: '' });
            setSelectedSparePart('');
            setOpenDialog(false); // Close the dialog after creation
            fetchSpareParts(); // Fetch updated spare parts to refresh the table
        } catch (error) {
            console.error('Error creating spare part:', error.response || error);
        }
    };

    // Open the edit dialog and populate with existing data
    const openEditForm = (sparePart) => {
        setEditSparePart(sparePart);
        setOpenEditDialog(true); // Open the edit dialog
    };

    // Handle spare part update (Admin only)
    const handleUpdateSparePart = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/SparePart/${editSparePart.sparePartId}`,
                {
                  sparePartId: editSparePart.sparePartId, // Include the ID in the body
                  name: editSparePart.name,               // Optional: You may send the name if it can be updated
                  stockLevel: editSparePart.stockLevel,   // Updated stock level
                  cost: editSparePart.cost                // Updated cost
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setOpenEditDialog(false); // Close the edit dialog after updating
            fetchSpareParts(); // Fetch updated spare parts to refresh the table
        } catch (error) {
            console.error('Error updating spare part:', error.response || error);
        }
    };

    // Function to delete a spare part (Admin only)
    const handleDeleteSparePart = async (sparePartId) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/SparePart/${sparePartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSpareParts(); // Fetch spare parts again to update the table
        } catch (error) {
            console.error('Error deleting spare part:', error.response || error);
        }
    };

    return (
        <Container>
            <Grid container spacing={3}>
                {/* Adjust margin-top to reduce space above heading */}
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                    <h1>Spare Parts</h1>
                    {/* Adding scrollable table container */}
                    <Box sx={{ maxHeight: '280px', overflowY: 'auto', width: '100%' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Stock Level</TableCell>
                                    <TableCell>Cost</TableCell>
                                    {(role === 'Admin' || role === 'Technician') && <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {spareParts.map((sparePart) => (
                                    <TableRow key={sparePart.sparePartId}>
                                        <TableCell>{sparePart.sparePartId}</TableCell>
                                        <TableCell>{sparePart.name}</TableCell>
                                        <TableCell>{sparePart.stockLevel}</TableCell>
                                        <TableCell>${sparePart.cost}</TableCell>
                                        {(role === 'Admin' || role === 'Technician') && (
                                            <TableCell>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => openEditForm(sparePart)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleDeleteSparePart(sparePart.sparePartId)}
                                                >
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
                {(role === 'Admin' || role === 'Technician') && (
                    <Grid item xs={12} style={{ textAlign: 'right', marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }} // Ensure button stays visible
                            onClick={() => setOpenDialog(true)}
                        >
                            Add Spare Part
                        </Button>
                    </Grid>
                )}
            </Grid>

            {/* Dialog for adding a new spare part (Admin only) */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add Spare Part</DialogTitle>
                <DialogContent>
                    {/* Dropdown for spare part selection */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="spare-part-select-label">Spare Part</InputLabel>
                        <Select
                            labelId="spare-part-select-label"
                            value={selectedSparePart}
                            onChange={handleSparePartSelect}
                            label="Spare Part"
                        >
                            {computerSpareParts.map((part) => (
                                <MenuItem key={part.id} value={part.name}>
                                    {part.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Stock Level */}
                    <TextField
                        label="Stock Level"
                        fullWidth
                        type="number"
                        value={newSparePart.stockLevel}
                        onChange={(e) => setNewSparePart({ ...newSparePart, stockLevel: e.target.value })}
                        margin="normal"
                    />
                    {/* Cost */}
                    <TextField
                        label="Cost"
                        fullWidth
                        type="number"
                        value={newSparePart.cost}
                        onChange={(e) => setNewSparePart({ ...newSparePart, cost: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSparePart} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit dialog for editing a spare part */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Spare Part</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Stock Level"
                        fullWidth
                        type="number"
                        value={editSparePart.stockLevel || ''}
                        onChange={(e) => setEditSparePart({ ...editSparePart, stockLevel: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        label="Cost"
                        fullWidth
                        type="number"
                        value={editSparePart.cost || ''}
                        onChange={(e) => setEditSparePart({ ...editSparePart, cost: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSparePart} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SparePart;
