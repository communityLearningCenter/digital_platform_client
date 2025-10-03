const api = import.meta.env.VITE_API;

function getToken() {
    return localStorage.getItem("token");
}

export async function postUser(data) {
    const res = await fetch(`${api}/users`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        return res.json();
    }
    throw new Error("Error: Check Network Log");
}

export async function postLogin(name, password) {
    const res = await fetch(`${api}/login?`, {
        method: "POST",
        body: JSON.stringify({ name, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        return res.json();
    }
    throw new Error("Incorrect username or password");
}

export async function fetchUser(id){
    const token = getToken();    
    console.log("token : ", token);
    const res = await fetch(`${api}/users/${id}`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchAllStudents(){
    const token = getToken();    
    const res = await fetch(`${api}/students`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchAllStudentsByLC(lcID){
    const token = getToken();    
    const res = await fetch(`${api}/learningcenters/${lcID}/students`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchStudent(id){
    const token = getToken();    
    const res = await fetch(`${api}/registration/${id}`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function postStudent(data) {
    const res = await fetch(`${api}/postStudent`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        return res.json();
    }
    throw new Error("Error: Check Network Log");
}

export async function updateStudent(id, data) {
  const token = getToken();
  const res = await fetch(`${api}/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update student: ${res.status}`);
  }
  return res.json();
}

export async function deleteStudent(id) {
  const token = getToken();
  const res = await fetch(`${api}/students/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete student: ${res.status}\n${text}`);
  }

  return res.json();
}

export async function fetchAllLCs(){
    const token = getToken();    
    const res = await fetch(`${api}/learningcenters`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchLCsbyUser(id){
    const token = getToken();    
    const res = await fetch(`${api}/users/${id}/learningcenters`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function postExamResults(data){    
    const res = await fetch(`${api}/postExamResults`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });    
   if (res.ok) {
        return res.json();
    }
    throw new Error("Error: Check Network Log");
}

export async function fetchAllExamResults(){
    const token = getToken();    
    const res = await fetch(`${api}/examresults`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchAllExamResultsByLC(lcID){
    const token = getToken();    
    const res = await fetch(`${api}/learningcenters/${lcID}/examresults`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchAllTeachers(){
    const token = getToken();    
    const res = await fetch(`${api}/teachers`, {
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const text = await res.text(); // Read text to inspect error
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function postTeacher(data){   
    const res = await fetch(`${api}/postTeacher`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });    
   if (res.ok) {
        return res.json();
    }
    throw new Error("Error: Check Network Log");
}