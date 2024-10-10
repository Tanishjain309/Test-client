import React, { useEffect, useState } from 'react';
import "../css/task.css";
import { useParams } from 'react-router-dom';
import instance from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateTask = ({ isUpdate, existingTask, onClose }) => {
    const {id} = useParams();
    const nav = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        priority: 'Medium',
        status: 'Pending',
    });

    useEffect(() => {
        if (isUpdate && existingTask) {
            setFormData({
                name: existingTask.name,
                startDate: existingTask.startDate.split('T')[0],
                endDate: existingTask.endDate.split('T')[0],
                priority: existingTask.priority,
                status: existingTask.status,
            });
        }
    }, [isUpdate, existingTask]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isUpdate
            ? `/api/projects/task/update/${existingTask._id}`
            : `/api/projects/${id}/task/create`;
            const response = await instance[isUpdate ? "put" : "post"](endpoint, { ...formData });
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            if(error.response){
                toast.error(error.response.data.message);
            }else {
                toast.error("An Unexpected Error Occurred.")
            }
        }
        nav(0);
        onClose();
    };

    return (
        <div className="create-task-modal">
            <h2>{isUpdate ? 'Update Task' : 'Create Task'}</h2>
            <form>
                <label>
                    Task Name:
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>
                    Start Date:
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleChange} required />
                </label>
                <label>
                    End Date:
                    <input type="date" id="endDate" value={formData.endDate} onChange={handleChange} required />
                </label>
                <label>
                    Priority:
                    <select id="priority" value={formData.priority} onChange={handleChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
                <label>
                    Status:
                    <select id="status" value={formData.status} onChange={handleChange}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Expired">Expired</option>
                    </select>
                </label>
                <button onClick={handleSubmit}>{isUpdate ? "Update": "Submit"}</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default CreateTask;
