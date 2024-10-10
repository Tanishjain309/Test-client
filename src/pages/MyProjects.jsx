import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import instance from '../utils/axios'; 
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import "../css/homepage.css"
import { toast } from 'react-hot-toast';
import {useNavigate} from "react-router-dom";
import Navbar from '../components/Navbar';
import useUserStore from '../store';

export default function MyProjectsTable() {
  const [projects, setProjects] = useState([]);
  const nav = useNavigate();
  const loggedIn = useUserStore((state) => state.loggedIn);
  const getProjects = async () => {
    try {
      const response = await instance.get('/api/projects/myProjects');
      if (response.status === 200) {
        setProjects(response.data.data); 
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Cannot Fetch Data. An Error Occurred.");
      }
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      toast.error("Please Login to See Your projects");
      nav("/");
      return 
    }
    getProjects();
    }, [loggedIn, nav]);;

  const handleClick = () => nav("/projects/create");
  const handleBtnClick = (id) => nav(`/projects/update/${id}`);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;
    try {
      const response = await instance.delete(`/api/projects/delete/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        setProjects((prevProjects) => prevProjects.filter(project => project._id !== id));
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
        <div className="project">
        <div className="project-header">
            <span> My Projects </span>
            <button className='btn' onClick={handleClick} > Create New Project </button>        
        </div>     
    <TableContainer component={Paper} sx={{ 
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
      <Table sx={{ minWidth: 650 }} aria-label="project table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}align="left">Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects && projects.length > 0  ?  (
              projects.map((project) => (
                <TableRow
                  key={project._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {project.name}
                  </TableCell>
                  <TableCell align="left">{project.description}</TableCell>
                  <TableCell align="left" >
                  <IconButton 
                        color="primary" 
                        onClick={() => handleBtnClick(project._id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        sx={{ color: 'red' }}
                        onClick={() => handleDelete(project._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow>
              <TableCell> No Data Found </TableCell>  
            </TableRow>
            
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </>
  );
}
