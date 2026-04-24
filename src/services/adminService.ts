export interface DashboardData {
  totalProjects: number;
  avgSavings: string;
  quoteRequests: number;
  satisfaction: string;
  growth: { month: string; projects: number }[];
  distribution: { label: string; value: number }[];
  recentProjects: { id: string; name: string; client: string; status: string; date: string }[];
  loginAttempts: { email: string; timestamp: string; status: string; ip: string }[];
}

export const adminLogin = async (email: string, password: string) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Erreur de connexion');
  }

  return response.json();
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch('/api/admin/dashboard', {
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }
    throw new Error("Impossible de récupérer les données du serveur.");
  }

  return response.json();
};

export const fetchPosts = async () => {
  const response = await fetch('/api/posts');
  if (!response.ok) throw new Error("Erreur lors du chargement des articles");
  return response.json();
};

export const createPost = async (post: any) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch('/api/admin/posts', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });
  if (!response.ok) throw new Error("Erreur lors de la création de l'article");
  return response.json();
};

export const updatePost = async (id: number, post: any) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`/api/admin/posts/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(post)
  });
  if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'article");
  return response.json();
};

export const deletePost = async (id: number) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`/api/admin/posts/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression de l'article");
  return response.json();
};

export const fetchProjects = async () => {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error("Erreur lors du chargement des projets");
  return response.json();
};

export const createProject = async (project: any) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch('/api/admin/projects', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error("Erreur lors de la création du projet");
  return response.json();
};

export const updateProject = async (id: string, project: any) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error("Erreur lors de la mise à jour du projet");
  return response.json();
};

export const deleteProject = async (id: string) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du projet");
  return response.json();
};

export const fetchComments = async (postId?: number) => {
  const url = postId ? `/api/comments/${postId}` : '/api/admin/comments';
  const token = localStorage.getItem('admin_token');
  const headers: any = {};
  if (!postId && token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error("Erreur lors du chargement des commentaires");
  return response.json();
};

export const createComment = async (comment: any) => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  });
  if (!response.ok) throw new Error("Erreur lors de l'envoi du commentaire");
  return response.json();
};

export const deleteComment = async (id: string) => {
  const token = localStorage.getItem('admin_token');
  const response = await fetch(`/api/admin/comments/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erreur lors de la suppression du commentaire");
  return response.json();
};

export const exportToCSV = (data: any[], fileName: string) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => {
    return Object.values(row).map(val => 
      typeof val === 'string' ? `"${val}"` : val
    ).join(',');
  });
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
