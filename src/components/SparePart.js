import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from './Authenication/utils';
import {
    Grid, Card, CardContent, CardActions, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, Select, MenuItem, IconButton, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const SparePart = () => {
    const [spareParts, setSpareParts] = useState([]);
    const [selectedSparePart, setSelectedSparePart] = useState('');
    const [newSparePart, setNewSparePart] = useState({ stockLevel: '', cost: '' });
    const [editSparePart, setEditSparePart] = useState({});
    const [role, setRole] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    
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
                setSpareParts(response.data);
            } catch (error) {
                console.error('Error fetching spare parts:', error);
            }
        }
    };

    useEffect(() => {
        fetchSpareParts();
    }, []);

    const handleCreateSparePart = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/SparePart`, {
                name: selectedSparePart,
                stockLevel: newSparePart.stockLevel,
                cost: newSparePart.cost
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewSparePart({ stockLevel: '', cost: '' });
            setSelectedSparePart('');
            setOpenDialog(false);
            fetchSpareParts();
        } catch (error) {
            console.error('Error creating spare part:', error.response || error);
        }
    };

    const openEditForm = (sparePart) => {
        setEditSparePart(sparePart);
        setOpenEditDialog(true);
    };

    const handleUpdateSparePart = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/SparePart/${editSparePart.sparePartId}`, {
                sparePartId: editSparePart.sparePartId,
                name: editSparePart.name,
                stockLevel: editSparePart.stockLevel,
                cost: editSparePart.cost
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOpenEditDialog(false);
            fetchSpareParts();
        } catch (error) {
            console.error('Error updating spare part:', error.response || error);
        }
    };

    const handleDeleteSparePart = async (sparePartId) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/SparePart/${sparePartId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSpareParts();
        } catch (error) {
            console.error('Error deleting spare part:', error.response || error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Spare Parts
            </Typography>

            <Grid container spacing={3}>
                {spareParts.map(sparePart => (
                    <Grid item xs={12} md={6} lg={4} key={sparePart.sparePartId}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">
                                    {sparePart.name}
                                </Typography>
                                <Typography variant="body2">
                                    Stock Level: {sparePart.stockLevel}
                                </Typography>
                                <Typography variant="body2">
                                    Cost: ${sparePart.cost.toFixed(2)}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                {(role === 'Admin' || role === 'Technician') && (
                                    <>
                                        <IconButton onClick={() => openEditForm(sparePart)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteSparePart(sparePart.sparePartId)}>
                                            <DeleteIcon style={{ color: 'red' }} />
                                        </IconButton>
                                    </>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {(role === 'Admin') && (
                <IconButton
                    onClick={() => setOpenDialog(true)}
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }}
                >
                    <AddIcon />
                </IconButton>
            )}

            {/* Dialog for adding a new spare part */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add Spare Part</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <Select
                            value={selectedSparePart}
                            onChange={(e) => setSelectedSparePart(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Select Spare Part</em>
                            </MenuItem>
                            {computerSpareParts.map(part => (
                                <MenuItem key={part.id} value={part.name}>
                                    {part.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Stock Level"
                        fullWidth
                        type="number"
                        value={newSparePart.stockLevel}
                        onChange={(e) => setNewSparePart({ ...newSparePart, stockLevel: e.target.value })}
                        margin="normal"
                    />

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
        </Box>
    );
};

export default SparePart;
