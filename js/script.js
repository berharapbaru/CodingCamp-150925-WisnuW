document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const errorMessage = document.getElementById("error-message");
  const deleteAllBtn = document.getElementById("delete-all-btn");
  const filterAllBtn = document.getElementById("filter-all-btn");
  const filterPendingBtn = document.getElementById("filter-pending-btn");
  const filterCompletedBtn = document.getElementById("filter-completed-btn");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let currentFilter = "all";

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos() {
    todoList.innerHTML = "";
    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === "pending") {
        return !todo.completed;
      }
      if (currentFilter === "completed") {
        return todo.completed;
      }
      return true;
    });

    if (filteredTodos.length === 0) {
      const noTaskItem = document.createElement("li");
      noTaskItem.textContent = "Tidak ada tugas ditemukan";
      noTaskItem.classList.add("no-task-found");
      todoList.appendChild(noTaskItem);
      return;
    }

    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.classList.add("todo-item");
      if (todo.completed) {
        li.classList.add("completed");
      }

      const taskInfo = document.createElement("div");
      taskInfo.classList.add("task-info");
      const taskText = document.createElement("span");
      taskText.classList.add("task-text");
      taskText.textContent = todo.text;
      const dueDate = document.createElement("span");
      dueDate.classList.add("due-date");
      taskInfo.appendChild(taskText);
      taskInfo.appendChild(dueDate);

      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("actions");

      const completeBtn = document.createElement("button");
      completeBtn.classList.add("complete-btn");
      completeBtn.textContent = todo.completed ? "Batal" : "Selesai";
      completeBtn.addEventListener("click", () => {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Hapus";
      deleteBtn.addEventListener("click", () => {
        li.classList.add("deleting");
        li.addEventListener("animationend", () => {
          todos = todos.filter((item) => item.id !== todo.id);
          saveTodos();
          renderTodos();
        });
      });

      actionsDiv.appendChild(completeBtn);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(taskInfo);
      li.appendChild(actionsDiv);
      todoList.appendChild(li);
    });
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  // Event Listeners
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    const todoDate = dateInput.value;

    // Validasi input form
    if (todoText === "") {
      errorMessage.textContent = "Nama tugas tidak boleh kosong!";
      return;
    }
    errorMessage.textContent = "";

    const newTodo = {
      id: Date.now(),
      text: todoText,
      date: todoDate,
      completed: false,
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = "";
    dateInput.value = "";
  });

  deleteAllBtn.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
      todos = [];
      saveTodos();
      renderTodos();
    }
  });

  filterAllBtn.addEventListener("click", () => {
    currentFilter = "all";
    setActiveFilterButton(filterAllBtn);
    renderTodos();
  });

  filterPendingBtn.addEventListener("click", () => {
    currentFilter = "pending";
    setActiveFilterButton(filterPendingBtn);
    renderTodos();
  });

  filterCompletedBtn.addEventListener("click", () => {
    currentFilter = "completed";
    setActiveFilterButton(filterCompletedBtn);
    renderTodos();
  });

  function setActiveFilterButton(activeButton) {
    const filterButtons = [filterAllBtn, filterPendingBtn, filterCompletedBtn];
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  // Initial render
  renderTodos();
});
