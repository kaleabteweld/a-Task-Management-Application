import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem } from '@mui/material';
import { Add, Delete, Edit, Logout } from '@mui/icons-material';
import { ITask, PriorityEnum, StatusEnum } from '../../features/types/task.type';
import { useCategoriesQuery, useRemoveTaskMutation, useSearchTasksQuery, useUpdateTaskMutation } from '../../features/slices/task.slice';
import { UserIsLoggedIn } from '../../hook/user.hook';
import CreateDialog from './CreateDialog';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/slices/user.slice';
import { setAccessToken } from '../../features/apiSlice';

export default function Home() {

    UserIsLoggedIn();
    const { data: tasks } = useSearchTasksQuery({ page: 1, searchParams: {} }, { refetchOnMountOrArgChange: true });
    const [remove] = useRemoveTaskMutation();

    const [open, setOpen] = useState(false);
    const [CreateOpen, setCreateOpen] = useState(false);
    const [updatedTask, setUpdatedTask] = useState<ITask | null>(null);
    const [logout] = useLogoutMutation();

    const navigate = useNavigate()

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
            <CreateDialog open={CreateOpen} handleClose={() => setCreateOpen(false)} />

            <IconButton onClick={() => {
                navigate('/search')
            }} color="inherit">
                <SearchIcon />
            </IconButton>


            <IconButton edge="end" aria-label="delete" onClick={() => setCreateOpen(true)}>
                <Add />
            </IconButton>

            <IconButton onClick={() => {
                logout();
                setAccessToken('');
            }} color="inherit">
                <Logout />
            </IconButton>

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
                        <IconButton edge="end" aria-label="edit" onClick={() => {
                            remove(task._id);
                        }}>
                            <Delete />
                        </IconButton>

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

    useEffect(() => {
        setUpdatedTask(task);
    }, [task]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);
        setUpdatedTask({ ...updatedTask, [name]: value as any } as any);
    }

    const handleUpdate = async () => {
        try {
            delete (updatedTask as any)["_id"];
            await updateTask({
                id: task?._id ?? "", task: {
                    title: updatedTask?.title,
                    description: updatedTask?.description,
                    deadline: updatedTask?.deadline,
                    priority: updatedTask?.priority as any,
                    status: updatedTask?.status as any,
                }
            }).unwrap();
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
                <Select
                    margin="dense"
                    id="priority"
                    name="priority"
                    label="Priority"
                    fullWidth
                    value={updatedTask?.priority || PriorityEnum.low}
                    onChange={handleInputChange as any}
                >
                    {Object.values(PriorityEnum).map((priority) => (
                        <MenuItem key={priority.toString()} value={priority.toString()}>
                            {priority}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    margin="dense"
                    id="status"
                    name="status"
                    label="Status"
                    fullWidth
                    value={updatedTask?.status || StatusEnum.pending}
                    onChange={handleInputChange as any}
                >
                    {Object.values(StatusEnum).map((status) => (
                        <MenuItem key={status.toString()} value={status.toString()}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
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