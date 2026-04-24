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
