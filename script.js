import { 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const form = document.getElementById("formPelanggan");
const tabel = document.getElementById("tabelPelanggan");
const search = document.getElementById("search");

const pelangganRef = collection(db, "pelanggan"); // nama koleksi di Firestore

// Render data ke tabel
async function renderTabel(filter = "") {
  tabel.innerHTML = "";
  const snapshot = await getDocs(pelangganRef);
  snapshot.forEach((d) => {
    const p = d.data();
    if (p.nama.toLowerCase().includes(filter.toLowerCase())) {
      const row = `
        <tr>
          <td>${p.nama}</td>
          <td>${p.telp}</td>
          <td>${p.alamat}</td>
          <td>
            <button class="edit" onclick="editPelanggan('${d.id}', '${p.nama}', '${p.telp}', '${p.alamat}')">Edit</button>
            <button class="hapus" onclick="hapusPelanggan('${d.id}')">Hapus</button>
          </td>
        </tr>`;
      tabel.innerHTML += row;
    }
  });
}

// Tambah/Edit data
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("pelangganId").value;
  const nama = document.getElementById("nama").value;
  const telp = document.getElementById("telp").value;
  const alamat = document.getElementById("alamat").value;

  if (id) {
    await updateDoc(doc(db, "pelanggan", id), { nama, telp, alamat });
  } else {
    await addDoc(pelangganRef, { nama, telp, alamat });
  }

  renderTabel();
  form.reset();
  document.getElementById("pelangganId").value = "";
});

// Edit data
window.editPelanggan = function(id, nama, telp, alamat) {
  document.getElementById("pelangganId").value = id;
  document.getElementById("nama").value = nama;
  document.getElementById("telp").value = telp;
  document.getElementById("alamat").value = alamat;
};

// Hapus data
window.hapusPelanggan = async function(id) {
  if (confirm("Yakin ingin menghapus data ini?")) {
    await deleteDoc(doc(db, "pelanggan", id));
    renderTabel();
  }
};

// Search
search.addEventListener("input", (e) => {
  renderTabel(e.target.value);
});

// Tampilkan awal
renderTabel();
