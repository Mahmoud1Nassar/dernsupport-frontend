import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parseJwt } from './Authenication/utils';
import {
    Container, Button, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Quote = () => {
    const [supportRequests, setSupportRequests] = useState([]);
    const [spareParts, setSpareParts] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [selectedSupportRequest, setSelectedSupportRequest] = useState('');
    const [selectedSpareParts, setSelectedSpareParts] = useState([]);
    const [description, setDescription] = useState('');
    const [totalCost, setTotalCost] = useState(0); // Total cost state
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentQuoteId, setCurrentQuoteId] = useState(null); // For editing quotes
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState(''); // Customer's user ID

    // Fetch support requests, spare parts, and quotes when the component mounts
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found.');
            return;
        }

        const decodedToken = parseJwt(token); // Decoding the token
        setUserRole(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']); // Extract role
        setUserId(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']); // Get the user ID

        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [supportRequestsResponse, sparePartsResponse, quotesResponse] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/SupportRequest`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/SparePart`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/Quote`, { headers })
            ]);

            setSpareParts(sparePartsResponse.data);

            // If the user is a customer, filter the support requests and quotes
            if (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Customer') {
                const customerSupportRequests = supportRequestsResponse.data.filter(req => req.userId === decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
                setSupportRequests(customerSupportRequests);

                // Filter quotes to only show those linked to the customer's support requests
                const customerQuotes = quotesResponse.data.filter(quote => customerSupportRequests.some(req => req.supportRequestId === quote.supportRequestId));
                setQuotes(customerQuotes);
            } else {
                // Admin and Technicians can see all support requests and quotes
                setSupportRequests(supportRequestsResponse.data);
                setQuotes(quotesResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error.response || error);
        }
    };

    // Calculate total cost based on selected spare parts
    const calculateTotalCost = () => {
        const cost = selectedSpareParts.reduce((acc, partId) => {
            const part = spareParts.find(sp => sp.sparePartId === partId);
            return acc + (part ? part.cost : 0);
        }, 0);
        setTotalCost(cost); // Update total cost state

        // Store total cost in local storage for backup (if needed)
        localStorage.setItem('totalCost', cost);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate cost whenever spare parts change
    useEffect(() => {
        calculateTotalCost();
    }, [selectedSpareParts]);

    // Update stock level of selected spare parts
    const updateSparePartStock = async (sparePartId) => {
        const selectedPart = spareParts.find(sp => sp.sparePartId === sparePartId);
        if (selectedPart) {
            const updatedSparePart = {
                sparePartId: selectedPart.sparePartId,
                name: selectedPart.name,
                stockLevel: selectedPart.stockLevel - 1,  // Decrease stock by 1
                cost: selectedPart.cost
            };

            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                await axios.put(`${process.env.REACT_APP_API_URL}/SparePart/${sparePartId}`, updatedSparePart, { headers });
            } catch (error) {
                console.error(`Error updating stock for spare part ${selectedPart.name}:`, error.response || error);
            }
        }
    };

    // Handle create or update quote action
    const handleCreateOrUpdateQuote = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const storedTotalCost = localStorage.getItem('totalCost') || totalCost;

        const quoteData = {
            supportRequestId: selectedSupportRequest,
            sparePartIds: selectedSpareParts,
            description,
            totalCost: storedTotalCost
        };

        try {
            if (editMode) {
                // Update existing quote
                await axios.put(`${process.env.REACT_APP_API_URL}/Quote/${currentQuoteId}`, quoteData, { headers });
            } else {
                // Create new quote
                await axios.post(`${process.env.REACT_APP_API_URL}/Quote`, quoteData, { headers });
                await Promise.all(selectedSpareParts.map(sparePartId => updateSparePartStock(sparePartId)));
            }

            setOpenDialog(false);
            setEditMode(false);
            setCurrentQuoteId(null);
            setSelectedSupportRequest('');
            setSelectedSpareParts([]);
            setDescription('');
            setTotalCost(0);
            localStorage.removeItem('totalCost');
            fetchData(); // Refresh quotes
        } catch (error) {
            console.error('Error submitting quote:', error.response || error);
        }
    };

    // Handle quote deletion
    const handleDeleteQuote = async (quoteId) => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/Quote/${quoteId}`, { headers });
            fetchData(); // Refresh the quotes after deletion
        } catch (error) {
            console.error('Error deleting quote:', error.response || error);
        }
    };

    // Open edit dialog
    const handleEditQuote = (quote) => {
        setEditMode(true);
        setCurrentQuoteId(quote.quoteId);
        setSelectedSupportRequest(quote.supportRequestId);
        setSelectedSpareParts(quote.sparePartIds || []);
        setDescription(quote.description);
        setTotalCost(quote.totalCost);
        setOpenDialog(true);
    };

    return (
        <Container>
            {userRole === 'Admin' || userRole === 'Technician' ? (
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Create Quote
                </Button>
            ) : null}

            {/* Display list of quotes in a table */}
            <Typography variant="h4" style={{ marginTop: '20px' }}>Quotes</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Support Request</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Total Cost</TableCell>
                        {(userRole === 'Admin' || userRole === 'Technician') && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {quotes.map(quote => (
                        <TableRow key={quote.quoteId}>
                            <TableCell>{quote.quoteId}</TableCell>
                            <TableCell>{quote.supportRequestId}</TableCell>
                            <TableCell>{quote.description}</TableCell>
                            <TableCell>${quote.totalCost.toFixed(2)}</TableCell>
                            {(userRole === 'Admin' || userRole === 'Technician') && (
                                <TableCell>
                                    <IconButton onClick={() => handleEditQuote(quote)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteQuote(quote.quoteId)}>
                                        <DeleteIcon style={{ color: 'red' }} />
                                    </IconButton>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editMode ? 'Edit Quote' : 'Create Quote'}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="support-request-select-label">Select Support Request</InputLabel>
                        <Select
                            labelId="support-request-select-label"
                            value={selectedSupportRequest}
                            onChange={(e) => setSelectedSupportRequest(e.target.value)}
                        >
                            {supportRequests.map(request => (
                                <MenuItem key={request.supportRequestId} value={request.supportRequestId}>
                                    {request.issueType} - {request.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="spare-parts-select-label">Select Spare Parts</InputLabel>
                        <Select
                            labelId="spare-parts-select-label"
                            multiple
                            value={selectedSpareParts}
                            onChange={(e) => setSelectedSpareParts(e.target.value)}
                            renderValue={(selected) => selected.map(id => spareParts.find(sp => sp.sparePartId === id)?.name).join(', ')}
                        >
                            {spareParts.map(part => (
                                <MenuItem key={part.sparePartId} value={part.sparePartId}>
                                    {part.name} (${part.cost})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Typography variant="h6" margin="normal">
                        Total Cost: ${totalCost.toFixed(2)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateOrUpdateQuote} variant="contained" color="primary">
                        {editMode ? 'Update' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Quote;
