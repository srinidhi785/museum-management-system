import { useState } from "react";
import axios from "axios";
import "./App.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [page, setPage] = useState("dashboard");
  const [artists, setArtists] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

// Artwork States
const [artworks, setArtworks] = useState([]);
const [dashboardStats, setDashboardStats] = useState({
  total_artists: 0,
  total_artworks: 0,
  total_departments: 0,
});
const chartData = {
  labels: ["Artists", "Artworks", "Departments"],
  datasets: [
    {
      label: "Museum Statistics",
      data: [
        dashboardStats.total_artists,
        dashboardStats.total_artworks,
        dashboardStats.total_departments,
      ],
    },
  ],
};
const [artworkSearch, setArtworkSearch] = useState("");
const [artistSearch, setArtistSearch] = useState("");
const [departmentFilter, setDepartmentFilter] = useState("");
const [classificationFilter, setClassificationFilter] = useState("");
const [artistFilter, setArtistFilter] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const artworksPerPage = 10;
const [sortField, setSortField] = useState("id");
const [sortOrder, setSortOrder] = useState("asc");

const [title, setTitle] = useState("");
const [artistId, setArtistId] = useState("");
const [department, setDepartment] = useState("");
const [classification, setClassification] = useState("");
const [objectDate, setObjectDate] = useState("");

const [editingArtwork, setEditingArtwork] = useState(false);
const [editingArtworkId, setEditingArtworkId] = useState(null);
const [selectedArtwork, setSelectedArtwork] = useState(null);
const [previousPage, setPreviousPage] = useState("");

const [bulkArtworks, setBulkArtworks] = useState([
    {
      title: "",
      artist_id: "",
      department: "",
      classification: "",
      object_date: "",
    },
  ]);

  const [selectedArtworkIds, setSelectedArtworkIds] = useState([]);

  const login = async () => {
  try {
    console.log("Username:", username);
    console.log("Password:", password);

    const response = await axios.post("http://127.0.0.1:8000/login", {
      username,
      password,
    });

    console.log(response.data);

    // Load dashboard statistics first
    await loadDashboardStats();

    // Then show the dashboard
    setLoggedIn(true);

  } catch (error) {
    console.error("Full Error:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    }

    alert("Login failed.");
  }
};

const loadArtists = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/artists/");

    console.log(response.data);

    setArtists(response.data);

    setPage("artists");
  } catch (error) {
    console.error(error);
    alert("Failed to load artists");
  }
};

const fetchArtworks = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/artworks/");
    setArtworks(response.data);
  } catch (error) {
    console.log(error);
  }
};
  const loadArtworks = async () => {
  console.log("Step 1");

  try {
    console.log("Step 2");

    const response = await axios.get("http://127.0.0.1:8000/artworks/");

    console.log("Step 3", response.data);

    setArtworks(response.data);

    console.log("Step 4");

    setPage("artworks");

    console.log("Step 5");

  } catch (error) {
    console.log("ERROR:", error);
    console.log(error.response);
  }
};

const loadDashboardStats = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/dashboard/stats"
    );

    setDashboardStats(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const saveArtist = async () => {
    if (
      name.trim() === "" ||
      nationality.trim() === "" ||
      gender.trim() === "" ||
      birthYear === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      console.log("Step 1 - Save button clicked");

    if (editing) {
      console.log("Step 2 - Updating artist");

      const response = await axios.put(
        `http://127.0.0.1:8000/artists/${editingId}`,
        {
          name,
          nationality,
          gender,
          birth_year: Number(birthYear),
          death_year: deathYear === "" ? null : Number(deathYear),
        }
      );
      alert("Artist updated successfully!");

      console.log("Step 3 - Update response:", response.data);

    } else {
      console.log("Step 2 - Adding artist");

      const response = await axios.post(
        "http://127.0.0.1:8000/artists/",
        {
          name,
          nationality,
          gender,
          birth_year: Number(birthYear),
          death_year: deathYear === "" ? null : Number(deathYear),
        }
      );

      console.log("Step 3 - Add response:", response.data);

      alert("Artist Added Successfully!");
    }

    console.log("Step 4 - Loading artists");

    loadArtists();

    console.log("Step 5 - Finished");
  }  catch (error) {
    console.error("SAVE ERROR:", error);
    console.error(error.response);
    alert(
      error.response?.data?.detail ||
      "Failed to save artist. Please try again."
    );
  }
};
const saveArtwork = async () => {
  if (
  title.trim() === "" ||
  artistId === "" ||
  department.trim() === "" ||
  classification.trim() === "" ||
  objectDate.trim() === ""
) {
  alert("Please fill in all required fields.");
  return;
}
  try {
    const response = await axios.post("http://127.0.0.1:8000/artworks/", {
      title: title,
      artist_id: Number(artistId),
      department: department,
      classification: classification,
      object_date: objectDate,
    });
    alert("Artwork added successfully!");

    console.log("Response:", response.data);

    setShowArtworkForm(false);
    loadArtworks();

  }  catch (error) {
    console.error(error);
    alert(
      error.response?.data?.detail ||
      "Failed to save artwork. Please try again."
    );
  }
};
const editArtwork = (artwork) => {
  setTitle(artwork.title);
  setArtistId(artwork.artist_id);
  setDepartment(artwork.department);
  setClassification(artwork.classification);
  setObjectDate(artwork.object_date);

  setEditingArtwork(true);
  setEditingArtworkId(artwork.id);

  setShowArtworkForm(true);
};
const deleteArtwork = async (id) => {
  console.log("Delete clicked:", id);

  const confirmed = window.confirm(
    "Are you sure you want to delete this artwork?"
  );

  if (!confirmed) {
    alert("Deletion cancelled.");
    return;
  }

  try {
    await axios.delete(`http://127.0.0.1:8000/artworks/${id}`);

    alert("Artwork deleted successfully!");

    loadArtworks();
  } catch (error) {
  console.error(error);

  alert(
    error.response?.data?.detail ||
    "Failed to delete artwork. Please try again."
  );
}
};

const saveBulkArtworks = async () => {
  try {
    await axios.post(
      "http://127.0.0.1:8000/artworks/bulk",
      {
        artworks: bulkArtworks,
      }
    );

    alert("Bulk artworks added successfully!");

    setBulkArtworks([
      {
        title: "",
        artist_id: "",
        department: "",
        classification: "",
        object_date: "",
      },
    ]);

    loadArtworks();
    setPage("artworks");
  } catch (error) {
    console.error(error);
    alert("Failed to add artworks.");
  }
};

const deleteSelectedArtworks = async () => {
  if (selectedArtworkIds.length === 0) {
    alert("Please select at least one artwork.");
    return;
  }

  try {
    await axios.delete(
      "http://127.0.0.1:8000/artworks/bulk",
      {
        data: {
          ids: selectedArtworkIds,
        },
      }
    );

    alert("Selected artworks deleted successfully!");

    setSelectedArtworkIds([]);

    await fetchArtworks();

  } catch (error) {
    console.error(error);
    alert("Failed to delete artworks.");
  }
};
const deleteArtist = async (id) => {
  console.log("Delete clicked:", id);

  const confirmed = window.confirm(
    "Are you sure you want to delete this artist?"
  );

  if (!confirmed) {
  alert("Deletion cancelled.");
  return;
}

  try {
    await axios.delete(`http://127.0.0.1:8000/artists/${id}`);

    alert("Artist Deleted Successfully!");

    loadArtists();
  } catch (error) {
  console.error(error);

  alert(
    error.response?.data?.detail ||
    "Failed to delete artist. Please try again."
  );
}
};

const editArtist = (artist) => {
  setEditing(true);
  setEditingId(artist.id);

  setName(artist.name);
  setNationality(artist.nationality);
  setGender(artist.gender);
  setBirthYear(artist.birth_year);
  setDeathYear(artist.death_year || "");

  setShowAddForm(true);
};

  // ---------------- Dashboard ----------------
if (loggedIn && page === "dashboard") {
  return (
    <div className="container">
      <div className="login-box">

        <div className="dashboard-header">
          <h1>Museum Management System</h1>

          <p className="dashboard-subtitle">
            Administration Dashboard
          </p>

          <div className="welcome-section">
            <h2>Welcome Admin 👋</h2>
            <p>
              Manage artists, artworks and museum records efficiently.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            margin: "20px 0",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              minWidth: "150px",
            }}
          >
            <h3>👨‍🎨 Artists</h3>
            <h2>{dashboardStats.total_artists}</h2>
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              minWidth: "150px",
            }}
          >
            <h3>🖼 Artworks</h3>
            <h2>{dashboardStats.total_artworks}</h2>
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "10px",
              minWidth: "150px",
            }}
          >
            <h3>🏛 Departments</h3>
            <h2>{dashboardStats.total_departments}</h2>
          </div>
        </div>

        <div
          style={{
            width: "600px",
            margin: "30px auto",
          }}
        >
          <Bar data={chartData} />
        </div>

        <button onClick={loadArtists}>Artists</button>
        <br /><br />

        <button onClick={loadArtworks}>Artworks</button>
        <br /><br />

        <button onClick={() => setPage("bulkInsert")}>
          Bulk Insert Artworks
        </button>
        <br /><br />

        <button
          onClick={async () => {
            await fetchArtworks();
            setPage("bulkDelete");
          }}
        >
          Bulk Delete Artworks
        </button>

        <br /><br />

        <button
          onClick={async () => {
            await loadDashboardStats();
            setPage("dashboard");
          }}
        >
          Dashboard
        </button>

        <br /><br />

        <button
          onClick={() => {
            setLoggedIn(false);
            setUsername("");
            setPassword("");
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}
  // ---------------- Artists Page ----------------

  // ---------------- Artists Page ----------------

if (loggedIn && page === "artists") {
  return (
    <>
     

      <div className="artist-page">
        <h1>Artists</h1>

        <br />

        <button onClick={() => setPage("dashboard")}>Back</button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={loadArtists}
        >
          Refresh
        </button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setEditing(false);
            setEditingId(null);
            setName("");
            setNationality("");
            setGender("");
            setBirthYear("");
            setDeathYear("");
            setShowAddForm(true);
          }}
        >
          Add Artist
        </button>
<br />
<br />

<input
  type="text"
  placeholder="🔍 Search artist by name..."
  value={artistSearch}
  onChange={(e) => setArtistSearch(e.target.value)}
  style={{
    width: "300px",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
  }}
/>

<table className="artist-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Nationality</th>
              <th>Gender</th>
              <th>Birth Year</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
           {artists
           .filter((artist) =>
            (artist.name || "")
           .toLowerCase()
           .includes(artistSearch.toLowerCase())
          )
          .map((artist) => (
              <tr key={artist.id}>
                <td>{artist.id}</td>
                <td>{artist.name}</td>
                <td>{artist.nationality}</td>
                <td>{artist.gender}</td>
                <td>{artist.birth_year}</td>
                
                <td>
                  <button onClick={() => editArtist(artist)}>
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => deleteArtist(artist.id)}
                  >
                   Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
         {showAddForm && (
        <div className="artist-form">
          <h2>Add Artist</h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          <br />
          <br />

          <input
            type="number"
            placeholder="Birth Year"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
          />

          <br />
          <br />

          <input
            type="number"
            placeholder="Death Year"
            value={deathYear}
            onChange={(e) => setDeathYear(e.target.value)}
          />

          <br />
          <br />

          <button onClick={saveArtist}>Save Artist</button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
      </div>
    </>
  );
}

// ---------------- Artworks Page ----------------
if (loggedIn && page === "artworks") {
const filteredArtworks = artworks
  .filter((artwork) =>
    (artwork.title || "")
      .toLowerCase()
      .includes(artworkSearch.toLowerCase())
  )
  .filter((artwork) =>
    departmentFilter === "" ||
    artwork.department === departmentFilter
  )
  .filter((artwork) =>
    classificationFilter === "" ||
    artwork.classification === classificationFilter
  )
  .filter((artwork) =>
    artistFilter === "" ||
    String(artwork.artist_id) === artistFilter
  )
  .sort((a, b) => {
  let valueA = a[sortField];
  let valueB = b[sortField];

  // Handle text values
  if (typeof valueA === "string") {
    valueA = valueA.toLowerCase();
    valueB = valueB.toLowerCase();

    if (sortOrder === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  }

  // Handle number values
  if (sortOrder === "asc") {
    return valueA - valueB;
  } else {
    return valueB - valueA;
  }
});

    const indexOfLastArtwork = currentPage * artworksPerPage;
    const indexOfFirstArtwork = indexOfLastArtwork - artworksPerPage;
    const currentArtworks = filteredArtworks.slice(
      indexOfFirstArtwork,
      indexOfLastArtwork
    );
    const totalPages = Math.ceil(
      filteredArtworks.length / artworksPerPage
    );

  return (
    <div className="artist-page">
      <h1>Artworks</h1>

      <button onClick={() => setPage("dashboard")}>
        Back
      </button>
      <button
      style={{ marginLeft: "10px" }}
      onClick={() =>
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        }
        >
          Sort ID ({sortOrder === "asc" ? "⬆️" : "⬇️"})
          </button>

      <br />
      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Total Artworks: {artworks.length}</h3>

        <button
          onClick={() => {
            setTitle("");
            setArtistId("");
            setDepartment("");
            setClassification("");
            setObjectDate("");

            setEditingArtwork(false);
            setEditingArtworkId(null);

            setShowArtworkForm(true);
          }}
        >
          Add Artwork
        </button>
      </div>

      <br />
      <br />
<br />
<input
  type="text"
  placeholder="🔍 Search artwork by title..."
  value={artworkSearch}
  onChange={(e) => {
    setArtworkSearch(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    width: "300px",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
  }}
/>

<br />
<br />


<select
  value={departmentFilter}
  onChange={(e) => {
    setDepartmentFilter(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
  }}
>
  <option value="">All Departments</option>

  {[...new Set(artworks.map((artwork) => artwork.department))]
    .sort()
    .map((department) => (
      <option key={department} value={department}>
        {department}
      </option>
    ))}
</select>

&nbsp;&nbsp;

<select
  value={classificationFilter}
  onChange={(e) => {
    setClassificationFilter(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
  }}
>
  <option value="">All Classifications</option>

  {[...new Set(
    artworks
      .map((artwork) => artwork.classification)
      .filter((c) => c)
  )]
    .sort()
    .map((classification) => (
      <option key={classification} value={classification}>
        {classification}
      </option>
    ))}
</select>

<br />
<br />

<select
  value={artistFilter}
  onChange={(e) => {
    setArtistFilter(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    padding: "10px",
    fontSize: "16px",
    marginBottom: "20px",
    marginLeft: "10px",
  }}
>
  <option value="">All Artists</option>

  {[...new Set(artworks.map((artwork) => artwork.artist_id))]
    .sort((a, b) => a - b)
    .map((artistId) => (
      <option key={artistId} value={artistId}>
        {artistId}
      </option>
    ))}
</select>

<br />
<br />
      

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
           <th
           style={{ cursor: "pointer" }}
           onClick={() => {
            setSortField("id");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}
            >
              ID {sortField === "id" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
              </th>
              <th
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSortField("title");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
                >
                  Title {sortField === "title" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                  </th>
                  <th
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSortField("artist_id");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    >
                      Artist ID {sortField === "artist_id" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                      </th>
                      <th
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSortField("department");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                        >
                          Department {sortField === "department" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
                          </th>
          <th
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSortField("classification");
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}
            >
              Classification {sortField === "classification" ? (sortOrder === "asc" ? "⬆️" : "⬇️") : ""}
              </th>
            <th>Object Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentArtworks.map((artwork) => (

        
            <tr key={artwork.id}>
              <td>{artwork.id}</td>
              <td>{artwork.title}</td>
              <td>{artwork.artist_id}</td>
              <td>{artwork.department}</td>
              <td>{artwork.classification}</td>
              <td>{artwork.object_date}</td>

              <td>
  <button
    onClick={() => {
      setSelectedArtwork(artwork);
      setPreviousPage("artworks");
      setPage("artworkDetails");
    }}
  >
    View
  </button>

  <button
    onClick={() => editArtwork(artwork)}
    style={{ marginLeft: "10px" }}
  >
    Edit
  </button>

  <button
    onClick={() => deleteArtwork(artwork.id)}
    style={{ marginLeft: "10px" }}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
  )
      {showArtworkForm && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>
              {editingArtwork ? "Edit Artwork" : "Add Artwork"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Artist ID"
              value={artistId}
              onChange={(e) => setArtistId(e.target.value)}
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="text"
              placeholder="Classification"
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
            />

            <input
              type="text"
              placeholder="Object Date"
              value={objectDate}
              onChange={(e) => setObjectDate(e.target.value)}
            />

            <br />
            <br />

            <button onClick={saveArtwork}>
              Save
            </button>

            <button onClick={() => setShowArtworkForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
}
if (loggedIn && page === "bulkInsert") {
  return (
    <div className="container">
      <div className="login-box" style={{ width: "95%" }}>
        <h2>Bulk Insert Artworks</h2>

        {bulkArtworks.map((artwork, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={artwork.title}
              onChange={(e) => {
                const updated = [...bulkArtworks];
                updated[index].title = e.target.value;
                setBulkArtworks(updated);
              }}
            />

            <br /><br />

            <input
              type="number"
              placeholder="Artist ID"
              value={artwork.artist_id}
              onChange={(e) => {
                const updated = [...bulkArtworks];
                updated[index].artist_id = e.target.value;
                setBulkArtworks(updated);
              }}
            />

            <br /><br />

            <input
              type="text"
              placeholder="Department"
              value={artwork.department}
              onChange={(e) => {
                const updated = [...bulkArtworks];
                updated[index].department = e.target.value;
                setBulkArtworks(updated);
              }}
            />

            <br /><br />

            <input
              type="text"
              placeholder="Classification"
              value={artwork.classification}
              onChange={(e) => {
                const updated = [...bulkArtworks];
                updated[index].classification = e.target.value;
                setBulkArtworks(updated);
              }}
            />

            <br /><br />

            <input
              type="text"
              placeholder="Object Date"
              value={artwork.object_date}
              onChange={(e) => {
                const updated = [...bulkArtworks];
                updated[index].object_date = e.target.value;
                setBulkArtworks(updated);
              }}
            />

            <br /><br />

            {bulkArtworks.length > 1 && (
              <button
                onClick={() => {
                  const updated = bulkArtworks.filter(
                    (_, i) => i !== index
                  );
                  setBulkArtworks(updated);
                }}
              >
                Remove Row
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() =>
            setBulkArtworks([
              ...bulkArtworks,
              {
                title: "",
                artist_id: "",
                department: "",
                classification: "",
                object_date: "",
              },
            ])
          }
        >
          Add Another Artwork
        </button>

        <br /><br />

        <button onClick={saveBulkArtworks}>
          Save All
        </button>

        <br /><br />

        <button onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
if (loggedIn && page === "bulkDelete") {

  return (
    <div>
      
<table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
  <thead>
    <tr>
      <th>Select</th>
      <th>ID</th>
      <th>Title</th>
      <th>Artist ID</th>
    </tr>
  </thead>

  <tbody>
    {artworks.map((artwork) => (
      <tr key={artwork.id}>
        <td>
          <input
            type="checkbox"
            checked={selectedArtworkIds.includes(artwork.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedArtworkIds([
                  ...selectedArtworkIds,
                  artwork.id,
                ]);
              } else {
                setSelectedArtworkIds(
                  selectedArtworkIds.filter(
                    (id) => id !== artwork.id
                  )
                );
              }
            }}
          />
        </td>

        <td>{artwork.id}</td>
        <td>{artwork.title}</td>
        <td>{artwork.artist_id}</td>
      </tr>
    ))}
  </tbody>
</table>

<br />

<table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
  <thead>
    <tr>
      <th>Select</th>
      <th>ID</th>
      <th>Title</th>
      <th>Artist ID</th>
    </tr>
  </thead>

  <tbody>
    {artworks.map((artwork) => (
      <tr key={artwork.id}>
        <td>
          <input
            type="checkbox"
            checked={selectedArtworkIds.includes(artwork.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedArtworkIds([
                  ...selectedArtworkIds,
                  artwork.id,
                ]);
              } else {
                setSelectedArtworkIds(
                  selectedArtworkIds.filter(
                    (id) => id !== artwork.id
                  )
                );
              }
            }}
          />
        </td>

        <td>{artwork.id}</td>
        <td>{artwork.title}</td>
        <td>{artwork.artist_id}</td>
      </tr>
    ))}
  </tbody>
</table>

<br />

<button onClick={deleteSelectedArtworks}>
  Delete Selected
</button>

<button
  onClick={() => setPage("dashboard")}
  style={{ marginLeft: "10px" }}
>
  Back
</button>

    </div>
  );
}

// ---------------- Artwork Details ----------------

if (loggedIn && page === "artworkDetails") {
  return (
    <div className="container">
      <div className="login-box">
        <h1>Artwork Details</h1>

        <p><strong>ID:</strong> {selectedArtwork?.id}</p>

        <p><strong>Title:</strong> {selectedArtwork?.title}</p>

        <p><strong>Artist ID:</strong> {selectedArtwork?.artist_id}</p>

        <p><strong>Department:</strong> {selectedArtwork?.department}</p>

        <p><strong>Classification:</strong> {selectedArtwork?.classification}</p>

        <p><strong>Object Date:</strong> {selectedArtwork?.object_date}</p>

        <br />

        <button onClick={() => setPage(previousPage)}>
          Back
        </button>
      </div>
    </div>
  );
}
  // ---------------- Login ----------------

  return (
    <div className="container">
      <div className="login-box">
        <h1>Museum App</h1>

        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default App;
