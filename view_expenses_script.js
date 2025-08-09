import { db } from './firebase_config.js';
import { collection, query, where, getDocs, orderBy, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// --- 预设数据 (与 add_expense_script.js 相同，用于填充查询表单) ---
const PREDEFINED_CATEGORIES = ["食物", "交通", "居住", "水電雜費", "娛樂", "醫療保健", "教育", "其他"];
const PREDEFINED_ADDED_BY = ["Aaron", "Ling"];

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素获取 ---
    const queryForm = document.getElementById('query-form');
    const resultsTableBody = document.getElementById('results-table-body');

    // 查询条件输入元素
    const dateStartInput = document.getElementById('query-date-start');
    const dateEndInput = document.getElementById('query-date-end');
    const categoryQuerySelect = document.getElementById('query-category');
    const addedByQuerySelect = document.getElementById('query-addedBy');
    const invoiceQueryInput = document.getElementById('query-invoice');
    const descriptionQueryInput = document.getElementById('query-description');

    // --- 初始化 ---
    // 动态填充查询表单的类别下拉列表
    PREDEFINED_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryQuerySelect.appendChild(option);
    });

    // 动态填充查询表单的新增人下拉列表
    PREDEFINED_ADDED_BY.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        addedByQuerySelect.appendChild(option);
    });

    // --- 事件监听与函数定义 ---
    if (queryForm) {
        queryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            fetchAndDisplayExpenses();
        });
    } else {
        console.error('Query form not found!');
    }

    async function fetchAndDisplayExpenses() {
        if (!resultsTableBody) {
            console.error('Results table body not found!');
            return;
        }
        resultsTableBody.innerHTML = ''; // 清空旧结果

        try {
            let expensesQuery = collection(db, "expenses");
            const queryConstraints = [];

            // 获取查询条件值
            const dateStart = dateStartInput.value;
            const dateEnd = dateEndInput.value;
            const category = categoryQuerySelect.value;
            const addedBy = addedByQuerySelect.value;
            const invoice = invoiceQueryInput.value.trim();
            const description = descriptionQueryInput.value.trim().toLowerCase(); // 转小写以便不区分大小写包含匹配

            // 构建查询约束
            if (dateStart) {
                queryConstraints.push(where("date", ">=", Timestamp.fromDate(new Date(dateStart))));
            }
            if (dateEnd) {
                // For end date, typically you want to include the whole day
                let endDateObj = new Date(dateEnd);
                endDateObj.setHours(23, 59, 59, 999); // Set to end of day
                queryConstraints.push(where("date", "<=", Timestamp.fromDate(endDateObj)));
            }
            if (category) {
                queryConstraints.push(where("category", "==", category));
            }
            if (addedBy) {
                queryConstraints.push(where("addedBy", "==", addedBy));
            }
            if (invoice) {
                queryConstraints.push(where("invoiceNumber", "==", invoice));
            }
            // Firestore does not support direct substring matching (like SQL LIKE) for queries.
            // Description search will be done client-side after fetching if needed, or by exact match if preferred.
            // For simplicity, we'll filter by description client-side if a keyword is provided.

            // 添加默认排序 (例如，按日期降序)
            queryConstraints.push(orderBy("date", "desc"));

            const finalQuery = query(expensesQuery, ...queryConstraints);
            const querySnapshot = await getDocs(finalQuery);

            if (querySnapshot.empty) {
                const row = resultsTableBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 6; // 根据表格列数调整
                cell.textContent = '未找到符合條件的開支紀錄。';
                cell.style.textAlign = 'center';
                return;
            }

            let results = [];
            querySnapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });

            // 客户端过滤备注 (如果提供了备注查询条件)
            if (description) {
                results = results.filter(expense =>
                    expense.description && expense.description.toLowerCase().includes(description)
                );
                 if (results.length === 0) {
                    const row = resultsTableBody.insertRow();
                    const cell = row.insertCell();
                    cell.colSpan = 6;
                    cell.textContent = '未找到符合條件的開支紀錄 (備註過濾後)。';
                    cell.style.textAlign = 'center';
                    return;
                }
            }

            results.forEach(data => {
                const row = resultsTableBody.insertRow();
                row.insertCell().textContent = data.date.toDate().toLocaleDateString(); // 格式化日期
                row.insertCell().textContent = parseFloat(data.amount).toFixed(2);
                row.insertCell().textContent = data.category;
                row.insertCell().textContent = data.addedBy;
                row.insertCell().textContent = data.invoiceNumber;
                row.insertCell().textContent = data.description;
            });

        } catch (error) {
            console.error("Error fetching expenses: ", error);
            alert("查詢開支時發生錯誤：" + error.message);
            const row = resultsTableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = '查詢時發生錯誤，請檢查控制台日誌。';
            cell.style.textAlign = 'center';
        }
    }

    // 页面加载时初始加载所有数据 (或者可以根据需求，初始不加载，等待用户查询)
    fetchAndDisplayExpenses();
});
