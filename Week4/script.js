const STORAGE_KEY = 'campusdesk_students_v1';
const starterStudents = [
  {id:'s1',name:'Aanya Sharma',email:'aanya.sharma@example.com',roll:'CS2026001',department:'CSE',year:'2nd Year',status:'Active'},
  {id:'s2',name:'Rohan Verma',email:'rohan.verma@example.com',roll:'IT2026008',department:'IT',year:'3rd Year',status:'Active'},
  {id:'s3',name:'Meera Singh',email:'meera.singh@example.com',roll:'EC2026012',department:'ECE',year:'1st Year',status:'Inactive'},
  {id:'s4',name:'Kabir Gupta',email:'kabir.gupta@example.com',roll:'CS2024024',department:'CSE',year:'4th Year',status:'Active'}
];

const $ = (selector) => document.querySelector(selector);
const tbody = $('#student-table-body');
const modalBackdrop = $('#modal-backdrop');
const form = $('#student-form');
const searchInput = $('#search-input');
const departmentFilter = $('#department-filter');
const statusFilter = $('#status-filter');
const emptyState = $('#empty-state');
let students = loadStudents();
let toastTimer;

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? starterStudents.map(student => ({...student})) : JSON.parse(saved);
  } catch {
    return starterStudents.map(student => ({...student}));
  }
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch {
    showToast('Could not save in this browser. Check storage settings.');
    return false;
  }
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[char]));
}

function refreshDepartmentOptions() {
  const current = departmentFilter.value;
  const departments = [...new Set(students.map(s => s.department).filter(Boolean))].sort();
  departmentFilter.innerHTML = '<option value="">All departments</option>' +
    departments.map(dept => `<option value="${escapeHTML(dept)}">${escapeHTML(dept)}</option>`).join('');
  if (departments.includes(current)) departmentFilter.value = current;
}

function getVisibleStudents() {
  const query = searchInput.value.trim().toLowerCase();
  return students.filter(student => {
    const searchable = `${student.name} ${student.email} ${student.roll} ${student.department} ${student.year}`.toLowerCase();
    return (!query || searchable.includes(query)) &&
      (!departmentFilter.value || student.department === departmentFilter.value) &&
      (!statusFilter.value || student.status === statusFilter.value);
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function render() {
  refreshDepartmentOptions();
  const visible = getVisibleStudents();
  $('#total-count').textContent = students.length;
  $('#active-count').textContent = students.filter(s => s.status === 'Active').length;
  $('#department-count').textContent = new Set(students.map(s => s.department)).size;
  $('#record-count').textContent = `${visible.length} ${visible.length === 1 ? 'record' : 'records'}`;
  $('#showing-label').textContent = `Showing ${visible.length} of ${students.length} students`;
  tbody.innerHTML = visible.map(student => `
    <tr>
      <td><div class="student-cell"><div class="student-avatar">${escapeHTML(initials(student.name))}</div><div><div class="student-name">${escapeHTML(student.name)}</div><div class="student-email">${escapeHTML(student.email)}</div></div></div></td>
      <td class="roll">${escapeHTML(student.roll)}</td>
      <td><span class="department-tag">${escapeHTML(student.department)}</span></td>
      <td class="year-text">${escapeHTML(student.year)}</td>
      <td><span class="badge ${student.status === 'Active' ? 'active' : 'inactive'}">${escapeHTML(student.status)}</span></td>
      <td><div class="actions"><button class="icon-btn" data-action="edit" data-id="${escapeHTML(student.id)}" aria-label="Edit ${escapeHTML(student.name)}" title="Edit">✎</button><button class="icon-btn delete" data-action="delete" data-id="${escapeHTML(student.id)}" aria-label="Delete ${escapeHTML(student.name)}" title="Delete">⌫</button></div></td>
    </tr>`).join('');
  emptyState.classList.toggle('hidden', visible.length !== 0);
  $('table').classList.toggle('hidden', visible.length === 0);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2600);
}

function openModal(student = null) {
  form.reset();
  $('#form-error').textContent = '';
  $('#student-id').value = student?.id || '';
  $('#modal-title').textContent = student ? 'Edit student' : 'Add student';
  $('#save-student-btn').textContent = student ? 'Save changes' : 'Save student';
  if (student) {
    $('#student-name').value = student.name;
    $('#student-email').value = student.email;
    $('#student-roll').value = student.roll;
    $('#student-department').value = student.department;
    $('#student-year').value = student.year;
    $('#student-status').value = student.status;
  } else {
    $('#student-status').value = 'Active';
  }
  modalBackdrop.classList.remove('hidden');
  $('#student-name').focus();
}

function closeModal() {
  modalBackdrop.classList.add('hidden');
}

function handleSave(event) {
  event.preventDefault();
  const id = $('#student-id').value;
  const student = {
    id: id || `s${Date.now()}${Math.random().toString(16).slice(2, 6)}`,
    name: $('#student-name').value.trim(),
    email: $('#student-email').value.trim(),
    roll: $('#student-roll').value.trim(),
    department: $('#student-department').value,
    year: $('#student-year').value,
    status: $('#student-status').value
  };

  if (!student.name || !student.email || !student.roll || !student.department || !student.year) {
    $('#form-error').textContent = 'Please complete all required fields.';
    return;
  }
  const duplicateRoll = students.some(s => s.roll.toLowerCase() === student.roll.toLowerCase() && s.id !== id);
  if (duplicateRoll) {
    $('#form-error').textContent = 'That roll number already exists. Use a unique roll number.';
    return;
  }
  const duplicateEmail = students.some(s => s.email.toLowerCase() === student.email.toLowerCase() && s.id !== id);
  if (duplicateEmail) {
    $('#form-error').textContent = 'That email is already in the directory. Use a unique email.';
    return;
  }

  if (id) {
    students = students.map(s => s.id === id ? student : s);
    showToast('Student details updated.');
  } else {
    students.push(student);
    showToast('Student added successfully.');
  }
  saveStudents();
  render();
  closeModal();
}

$('#add-student-btn').addEventListener('click', () => openModal());
$('#empty-add-btn').addEventListener('click', () => openModal());
$('#close-modal').addEventListener('click', closeModal);
$('#cancel-modal').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) closeModal();
});
form.addEventListener('submit', handleSave);
searchInput.addEventListener('input', render);
departmentFilter.addEventListener('change', render);
statusFilter.addEventListener('change', render);
$('#clear-filters').addEventListener('click', () => {
  searchInput.value = '';
  departmentFilter.value = '';
  statusFilter.value = '';
  render();
});
tbody.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const student = students.find(s => s.id === button.dataset.id);
  if (!student) return;
  if (button.dataset.action === 'edit') {
    openModal(student);
  } else if (button.dataset.action === 'delete') {
    if (confirm(`Delete ${student.name}'s record? This cannot be undone.`)) {
      students = students.filter(s => s.id !== student.id);
      saveStudents();
      render();
      showToast('Student record deleted.');
    }
  }
});

render();
