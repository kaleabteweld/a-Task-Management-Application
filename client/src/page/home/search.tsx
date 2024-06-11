import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Box, ListItem, ListItemText, Typography, ListItemSecondaryAction } from '@mui/material';
import { useCategoriesQuery, useLazySearchTasksQuery } from '../../features/slices/task.slice';
import { StatusEnum } from '../../features/types/task.type';

const SearchComponent = () => {
    const [searchParams, setSearchParams] = useState<any>({

    });
    const [triggerSearch, { data: tasks, isLoading }] = useLazySearchTasksQuery();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setSearchParams({ ...searchParams, [name!]: value });
    };

    const handleSearch = () => {
        triggerSearch({ page: 1, searchParams });
    };

    return (
        <Box p={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        name="title"
                        label="Title"
                        fullWidth
                        value={searchParams.title}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        name="description"
                        label="Description"
                        fullWidth
                        value={searchParams.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={searchParams.status}
                            onChange={handleChange as any}
                        >
                            {Object.values(StatusEnum).map(status => (
                                <MenuItem key={status} value={status.toString()}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            name="sortBy"
                            value={searchParams.sortBy}
                            onChange={handleChange as any}
                        >
                            <MenuItem value="priority">Priority</MenuItem>
                            <MenuItem value="deadline">Deadline</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>

            {isLoading && <p>Loading...</p>}
            {tasks && (
                <div>
                    <h2>Search Results</h2>
                    <ul>
                        {tasks.map(task => (
                            <ListItem key={task._id}>
                                <ListItemText
                                    primary={task.title}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="textPrimary">
                                                Description: {task.description}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Deadline: {new Date(task.deadline).toLocaleDateString()}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Priority: {task.priority}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Status: {task.status}
                                            </Typography>
                                            <br />
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Categories: {task.categories.map((category) => category.name).join(', ')}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </ul>
                </div>
            )}
        </Box>
    );
};

export default SearchComponent;
