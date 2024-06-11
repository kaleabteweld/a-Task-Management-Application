import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { ITask, PriorityEnum, StatusEnum } from '../../features/types/task.type';
import { useCategoriesQuery, useSearchTasksQuery, useUpdateTaskMutation } from '../../features/slices/task.slice';

export default function Home() {

    const { data: tasks } = useSearchTasksQuery({});

    const [open, setOpen] = useState(false);
    const [updatedTask, setUpdatedTask] = useState<ITask | null>(null);

    const handleOpen = (task: ITask) => {
        setUpdatedTask(task);
        setOpen(true);
    };

    const handleClose = () => {
        setUpdatedTask(null);
        setOpen(false);
    };

    return (
        <List>
            <UpdateDialog task={updatedTask} handleClose={handleClose} open={open} />

            {tasks && tasks.map((task: ITask) => (
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
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(task)}>
                            <Edit />
                        </IconButton>
                        {/* <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task._id)}>
                            <Delete />
                        </IconButton> */}
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>

    )
}

function UpdateDialog({ task, open, handleClose }: { handleClose: () => void, open: boolean, task?: ITask | null | undefined }) {

    const { data: categories } = useCategoriesQuery({ limit: 10, skip: 0 });
    const [updateTask] = useUpdateTaskMutation();
    const [updatedTask, setUpdatedTask] = React.useState<ITask | null | undefined>(task);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUpdatedTask({ ...updatedTask, [name]: value as any } as any);
    }

    const handleUpdate = async () => {
        try {
            delete (updatedTask as any)["_id"];
            await updateTask({ id: task?._id ?? "", task: updatedTask as any }).unwrap();
            handleClose();
        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    name="title"
                    label="Title"
                    fullWidth
                    value={updatedTask?.title}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    fullWidth
                    value={updatedTask?.description}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    id="deadline"
                    name="deadline"
                    label="Deadline"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={updatedTask ? new Date(updatedTask.deadline).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    id="priority"
                    name="priority"
                    select
                    label="Priority"
                    fullWidth
                    value={updatedTask?.priority}
                    onChange={handleInputChange}
                >
                    {Object.values(PriorityEnum).map((priority) => (
                        <option key={priority} value={priority.toString()}>
                            {priority}
                        </option>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    id="status"
                    name="status"
                    select
                    label="Status"
                    fullWidth
                    value={updatedTask?.status}
                    onChange={handleInputChange}
                >
                    {Object.values(StatusEnum).map((status) => (
                        <option key={status} value={status.toString()}>
                            {status}
                        </option>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    id="categories"
                    name="categories"
                    label="Categories"
                    fullWidth
                    value={categories?.map((category) => category.name).join(', ')}
                    onChange={handleInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}