import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, Calendar, Instagram, Facebook, Twitter } from 'lucide-react';

function InicioA() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        platform: 'facebook',
        scheduled_time: '',
        status: 'draft'
    });

    useEffect(() => {
        const name = localStorage.getItem('adminName');
        if (name) {
            setAdminName(name);
        }
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/posts/');
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            setError('Error al cargar las publicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedPost
                ? `http://localhost:8000/posts/${selectedPost.id}`
                : 'http://localhost:8000/posts/';
            
            const method = selectedPost ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchPosts();
                setFormData({
                    content: '',
                    platform: 'facebook',
                    scheduled_time: '',
                    status: 'draft'
                });
                setSelectedPost(null);
            }
        } catch (err) {
            setError('Error al guardar la publicación');
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8000/posts/${id}`, {
                method: 'DELETE',
            });
            fetchPosts();
        } catch (err) {
            setError('Error al eliminar la publicación');
        }
    };

    const handleEdit = (post) => {
        setSelectedPost(post);
        setFormData({
            content: post.content,
            platform: post.platform,
            scheduled_time: post.scheduled_time?.slice(0, 16) || '',
            status: post.status
        });
    };

    const redirectToUrl = (url) => {
        navigate(url);
    };

    const handleLogout = () => {
        localStorage.removeItem('tatuaName');
        navigate('/');
    };

    const getPlatformIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case 'instagram':
                return <Instagram className="h-5 w-5" />;
            case 'facebook':
                return <Facebook className="h-5 w-5" />;
            case 'twitter':
                return <Twitter className="h-5 w-5" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="FondoA">
                <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" onClick={() => redirectToUrl('/inicio_admin')}>TATTOOARTE</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/inicio_admin')}>INICIO</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/admin_tatuadores')}>TATUADORES</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/admin_viewers')}>VIEWERS</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={() => redirectToUrl('/admin_planes')}>PLANES</a>
                                </li>
                            </ul>
                            <div className="ms-auto p-2">
                                <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="container mt-4">
                    <div className="row">
                        <div className="col-12 text-center mb-4">
                            <h2>BIENVENIDO ADMINISTRADOR {adminName}</h2>
                        </div>
                    </div>

                    {/* Formulario de publicación */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">
                                        {selectedPost ? 'Editar Publicación' : 'Nueva Publicación'}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                placeholder="Contenido de la publicación"
                                                value={formData.content}
                                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                                rows="3"
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <select
                                                    className="form-select"
                                                    value={formData.platform}
                                                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                                                >
                                                    <option value="facebook">Facebook</option>
                                                    <option value="twitter">Twitter</option>
                                                    <option value="instagram">Instagram</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <select
                                                    className="form-select"
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                >
                                                    <option value="draft">Borrador</option>
                                                    <option value="scheduled">Programado</option>
                                                    <option value="published">Publicado</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={formData.scheduled_time}
                                                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">
                                            {selectedPost ? 'Actualizar' : 'Crear'} Publicación
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lista de publicaciones */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                {getPlatformIcon(post.platform)}
                                                <span className="ms-2 text-capitalize">{post.platform}</span>
                                            </div>
                                            <span className="badge bg-secondary">{post.status}</span>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">{post.content}</p>
                                            {post.scheduled_time && (
                                                <div className="text-muted small mb-3">
                                                    <Calendar className="me-1" size={16} />
                                                    {new Date(post.scheduled_time).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-footer d-flex justify-content-end gap-2">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleEdit(post)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioA;