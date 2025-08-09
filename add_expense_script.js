import { db } from './firebase_config.js'; // Import Firestore instance
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// --- 预设数据 ---
const PREDEFINED_CATEGORIES = ["食物", "交通", "居住", "水電雜費", "娛樂", "醫療保健", "教育", "其他"];
const PREDEFINED_ADDED_BY = ["Aaron", "Ling"];

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素获取 ---
    const expenseForm = document.getElementById('add-expense-form');
    const dateInput = document.getElementById('date');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const addedBySelect = document.getElementById('addedBy');
    const invoiceInput = document.getElementById('invoiceNumber');
    const descriptionInput = document.getElementById('description');
    // (Optional: একটি স্ট্যাটাস মেসেজ দেখানোর জন্য একটি এলিমেন্ট)
    // const statusMessageElement = document.getElementById('status-message');

    // --- 初始化 ---
    // 动态填充类别下拉列表
    PREDEFINED_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // 动态填充新增人下拉列表
    PREDEFINED_ADDED_BY.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        addedBySelect.appendChild(option);
    });

    // 预设日期时间为当前
    function setDefaultDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone for datetime-local
        dateInput.value = now.toISOString().slice(0,16);
    }
    setDefaultDateTime();

    // --- 事件监听 ---
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // 获取表单值
            const expenseData = {
                date: Timestamp.fromDate(new Date(dateInput.value)), // Store as Firestore Timestamp
                amount: parseFloat(amountInput.value),
                category: categorySelect.value,
                addedBy: addedBySelect.value,
                invoiceNumber: invoiceInput.value.trim(),
                description: descriptionInput.value.trim()
            };

            // 基本验证
            if (!dateInput.value) { // datetime-local can be tricky with 'required' sometimes
                alert('請選擇日期和時間。');
                return;
            }
            if (isNaN(expenseData.amount) || expenseData.amount <= 0) {
                alert('請輸入有效的正數金額。');
                return;
            }
            if (!expenseData.category) {
                alert('請選擇一個類別。');
                return;
            }
            if (!expenseData.addedBy) {
                alert('請選擇新增人。');
                return;
            }

            try {
                // 将数据添加到 Firestore
                const docRef = await addDoc(collection(db, "expenses"), expenseData);
                console.log("Document written with ID: ", docRef.id);
                alert('開支紀錄已成功儲存！');
                // (Optional: statusMessageElement.textContent = '開支紀錄已成功儲存！'; statusMessageElement.className = 'success';)

                // 清空表单
                expenseForm.reset();
                setDefaultDateTime(); // 重置日期为当前
                categorySelect.selectedIndex = 0; // 可选：重置下拉列表
                addedBySelect.selectedIndex = 0;  // 可选：重置下拉列表

            } catch (e) {
                console.error("Error adding document: ", e);
                alert('儲存開支紀錄時發生錯誤，請稍後再試。');
                // (Optional: statusMessageElement.textContent = '儲存開支紀錄時發生錯誤。'; statusMessageElement.className = 'error';)
            }
        });
    } else {
        console.error('Add expense form not found!');
    }
});
