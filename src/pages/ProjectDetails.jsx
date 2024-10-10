import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormContext from './FormContext';
import instance from '../utils/axios';
import { toast } from "react-hot-toast";
import Navbar from '../components/Navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Input, Button } from '@mui/material';
import CreateTask from './createTask';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProjectDetails = ({ isUpdate }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [edit, setEdit] = useState(false);
    const nav = useNavigate();
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await instance.get(`/api/projects/myProjects/${id}`);
                if (response.status === 200) {
                    setFormData(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred.");
                }
            }
        }
        if (isUpdate && id) {
            fetchData();
        }
    }, [id, isUpdate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description } = formData;
        try {
            const endpoint = isUpdate
                ? `/api/projects/update/${id}`
                : "/api/projects/create";
            const response = await instance[isUpdate ? "put" : "post"](endpoint, { ...formData });
            if (response.status === 200) {
                toast.success(response.data.message);
                if (!isUpdate) {
                    nav("/projects");
                } else {
                    setFormData(response.data.data); // Update formData for the edited project
                    setEdit(false);
                }
            }
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleToggleEdit = () => {
        setEdit((prev) => !prev);
    };

    const projectDetails = [
        { id: 'name', label: 'Name', type: 'text', value: formData.name },
        { id: 'description', label: 'Description', type: 'text', value: formData.description },
    ];
    const handleAddTaskClick = () => {
        setShowCreateTask(true);
    };

    const handleCloseCreateTask = () => {
        setShowCreateTask(false);
    };

    const handleViewTaskClick = (task) => {
        setSelectedTask(task);
        setShowCreateTask(true); 
    }
    const handleTaskDelete = async (taskId) => {
        const confirmed = window.confirm("Are you sure you want to delete this Task?");
        if (!confirmed) return;
        try {
          const response = await instance.delete(`/api/projects/task/delete/${taskId}`);
          if (response.status === 200) {
            toast.success(response.data.message);
            nav(0);
          }
        } catch (error) {
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Cannot Delete Project. An Error Occurred.");
          }
        }
    };

    return (
        <>
            <Navbar />
            {isUpdate === false && 
                <FormContext data={projectDetails} span="Project Details" handleSubmit={handleSubmit} handleChange={handleChange} />
            }
            {isUpdate && (
                <div className="project">
                    <div className="project-header">
                        <span> {formData.name} Project Details </span>
                            <Button variant="contained" onClick={handleAddTaskClick}>Add Task</Button>
                    </div>
                    <div className="project-header">
                        
                        {edit ? (
                            <div>
                                <Button variant="contained" onClick={handleSubmit} style={{ marginRight: '10px' }}>Save</Button>
                                <Button variant="outlined" onClick={handleToggleEdit}>Cancel</Button>
                            </div>
                        ) : (
                            <Button variant="contained" onClick={handleToggleEdit}>Edit Project Details</Button>
                        )}
                    </div>
                    <div className="project-details" style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {projectDetails.map(({ id, label, type, value }) => (
                            <div key={id} style={{ margin: '10px' }}>
                                <label htmlFor={id}>{label}</label>
                                {edit ? (
                                    <Input
                                        id={id}
                                        type={type}
                                        value={value}
                                        onChange={handleChange}
                                        style={{ marginLeft: '10px' }}
                                    />
                                ) : (
                                    <span style={{ marginLeft: '10px' }}>{value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="project table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Task Name</TableCell>
                                    <TableCell align="left">Priority</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">Start Date</TableCell>
                                    <TableCell align="left">End Date</TableCell>
                                    <TableCell align="left">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formData?.tasks ? (
                                    formData.tasks.map((task) => (
                                        <TableRow
                                            key={task._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {task.name}
                                            </TableCell>
                                            <TableCell align="left">{task.priority}</TableCell>
                                            <TableCell align="left">{task.status}</TableCell>
                                            <TableCell align="left">{new Date(task.startDate).toLocaleDateString('en-IN')}</TableCell>
                                            <TableCell align="left">{new Date(task.endDate).toLocaleDateString('en-IN')}</TableCell>
                                            <TableCell align="left">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleViewTaskClick(task)}
                                                >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton 
                                                sx={{ color: 'red' }}
                                                onClick={() => handleTaskDelete(task._id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7}> No Data Found </TableCell>  
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {showCreateTask && !selectedTask && (
                    <>
                        <div className="create-task-overlay" onClick={handleCloseCreateTask}></div>
                        <CreateTask isUpdate={false} existingTask={null} onClose={handleCloseCreateTask} />
                    </>
                    )}
                    {showCreateTask && id && selectedTask && (
                    <>
                        <div className="create-task-overlay" onClick={handleCloseCreateTask}></div>
                        <CreateTask isUpdate={true} existingTask={selectedTask} projectId={id} onClose={handleCloseCreateTask} />
                    </>
                    )}
                </div>
            )}
        </>
    );
}

export default ProjectDetails;

export const CreateProjects = () => <ProjectDetails isUpdate={false} />;
export const UpdateProjects = () => <ProjectDetails isUpdate={true} />;
