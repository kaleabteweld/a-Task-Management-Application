import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    MenuItem
} from "@mui/material";
import { useCreateTaskMutation } from "../../features/slices/task.slice";
import { PriorityEnum, StatusEnum, INewTask } from "../../features/types/task.type";

function CreateDialog({ open, handleClose }: { handleClose: () => void, open: boolean }) {
    const [createTask] = useCreateTaskMutation();
    const [newTask, setNewTask] = useState<INewTask>({
        title: '',
        description: '',
        deadline: new Date(),
        priority: PriorityEnum.low,
        status: StatusEnum.pending,
        categories: []
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewTask({ ...newTask, [name]: value } as any);
    };

    const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setNewTask({ ...newTask, [name as string]: value } as any);
    };

    const handleCreate = async () => {
        try {
            await createTask(newTask).unwrap();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Task</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    name="title"
                    label="Title"
                    fullWidth
                    value={newTask.title}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    id="description"
                    name="description"
                    label="Description"
                    fullWidth
                    value={newTask.description}
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
                    value={newTask.deadline.toISOString().split('T')[0]}
                    onChange={handleInputChange}
                />
                <TextField
                    margin="dense"
                    id="priority"
                    name="priority"
                    select
                    label="Priority"
                    fullWidth
                    value={newTask.priority}
                    onChange={handleSelectChange}
                >
                    {Object.values(PriorityEnum).map((priority) => (
                        <MenuItem key={priority} value={priority}>
                            {priority}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="dense"
                    id="status"
                    name="status"
                    select
                    label="Status"
                    fullWidth
                    value={newTask.status}
                    onChange={handleSelectChange}
                >
                    {Object.values(StatusEnum).map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateDialog;
