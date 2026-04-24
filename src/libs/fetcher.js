const api = import.meta.env.VITE_API_URL; //"https://digital-platform-api.onrender.com"; //

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
    const res = await fetch(`${api}/registration/id/${id}`, {
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

export async function fetchStudentbyStuID(stuID){
    const token = getToken();    
    console.log("stuID in fetcher : ", stuID);
    const res = await fetch(`${api}/registration/by-stuid/${stuID}`, {
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

export async function fetchStuCountbyAcaYr(){
    const token = getToken();    
    const res = await fetch(`${api}/stuCountbyAcaYr`, {
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

export async function fetchStuCountbyGrade({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/stuCountbyGrade?acayr=${encodeURIComponent(acayr)}`, {
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

export async function fetchKCStuCountbyLC({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/kcStuCountbyLC?acayr=${encodeURIComponent(acayr)}`, {
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

export async function fetchStuCountbyGender({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();        
    const res = await fetch(`${api}/stuCountbyGender?acayr=${encodeURIComponent(acayr)}`, {
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

export async function fetchStudentbyEnrollStatus({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();
    const res = await fetch(`${api}/stuCountbyEnrollStatus?acayr=${encodeURIComponent(acayr)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    if(!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch Failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchPWDStuCountbyGender({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();
    const res = await fetch(`${api}/pwdStuCountbyGender?acayr=${encodeURIComponent(acayr)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    if(!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch Failed: ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json();
}

export async function fetchTotalCount({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/totalCountforDashboard?acayr=${encodeURIComponent(acayr)}`, {
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
    const responseData = await res.json().catch(() => ({})); // safely parse JSON if possible

    if (!res.ok) {
        // Try to get backend message, fallback to HTTP status text
        const message = responseData?.msg || responseData?.error || res.statusText || "Something went wrong";
        throw new Error(message);
    }
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

export async function deleteExamResult(id) {
  const token = getToken();
  const res = await fetch(`${api}/examresults/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to delete exam result: ${res.status}\n${text}`);
  }
  return res.json();
}

export async function postAvgMarksandGrade(id){    
    const res = await fetch(`${api}/postAvgMarksandGrade/${id}`, {
        method: "POST",
        body: JSON.stringify(id),
        headers: {
            "Content-Type": "application/json",
        },
    });    
   if (res.ok) {
        return res.json();
    }
    throw new Error("Error: Check Network Log");
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

export async function fetchTeacher(id){
    const token = getToken();    
    const res = await fetch(`${api}/teachers/${id}`, {
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

export async function updateTeacher(id, data) {
  const token = getToken();
  const res = await fetch(`${api}/teachers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update teacher: ${res.status}`);
  }
  return res.json();
}

export async function fetchGradingCountforLPforFirstSession({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/gradingCountforLPforFirstSession?acayr=${encodeURIComponent(acayr)}`, {
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


export async function fetchGradingCountforLPforSecondSession({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/gradingCountforLPforSecondSession?acayr=${encodeURIComponent(acayr)}`, {
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

export async function fetchGradingCountforUPforFirstSession({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/gradingCountforUPforFirstSession?acayr=${encodeURIComponent(acayr)}`, {
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


export async function fetchGradingCountforUPforSecondSession({queryKey}){
    const [_key, acayr] = queryKey;   // get academic year
    const token = getToken();    
    const res = await fetch(`${api}/gradingCountforUPforSecondSession?acayr=${encodeURIComponent(acayr)}`, {
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

export async function fetchAllAcaYrs(){
    const token = getToken();    
    const res = await fetch(`${api}/acayrs`, {
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

export async function updateAcaYr(id, data) {
  const token = getToken();
  const res = await fetch(`${api}/acayrs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update academic year: ${res.status}`); 
  }
  return res.json();
}