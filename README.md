# 🚀 Junior QA Portfolio

Welcome to my portfolio! This project presents my skills in fullstack application development and test automation.

---

## 🛠️ Technologies and Tools
* **Language:** TypeScript / JavaScript
* **Frontend/Backend:** React, Next.js, Node.js
* **Database:** Supabase
* **E2E Automation:** Playwright
* **API Testing:** Postman and JavaScript
* **Versioning:** Git & GitHub

---

## 📂 Project Structure

* **`/tests`** – Automated Playwright E2E tests.
* **`/postman`** – Postman collections and test scripts used for server response validation and API checking.
* **`/app`** – API Backend (CRUD) and whole heart of the page.

---

## 🧪 Tests Overview

### 1. Automated Tests (Playwright)
* **Cart test:** Checking the correct operation of the product adding and removing mechanism | The test adds 20 items to the cart and then removes them until the cart is empty.
* **Order placement test:** Verification of the correctness of the purchasing process | The test adds products to the cart, fills in the order data, and checks the correctness of the save in the database.

<p align="center">
  <img src="Gifs/PlayWright.gif" alt="Demo aplikacji" width="700"/>
</p>

### 2. API Tests (Postman)
* **Verification of order creation:** The test sends a POST request with an incorrect sum of products; it verifies whether the system correctly rejects incorrect data and returns an appropriate error message.
* **Negative data validation test:** The test sends a POST request with an empty client name to check the further Validation test.
* **Order data validation:** The test checks if the GET endpoint returns status 200, if the price of each order exceeds 660 PLN, and if the required fields (first name, last name, address) are correctly filled.

<p align="center">
  <img src="Gifs/Postman.gif" alt="Demo aplikacji" width="700"/>
</p>

---

## 🎥 Presentation of the application's operation

<p align="center">
  <img src="Gifs/Strona.gif" alt="Demo aplikacji" width="700"/>
</p>

See how the application works in practice:
[Click here to watch the Project Overview](https://youtu.be/_v_ddbTG8UI)

---

## 📬 Contact
* **GitHub:** [PolishTango](https://github.com/PolishTango)
* **LinkedIn:** [Daniel Fronczak](https://www.linkedin.com/in/daniel-fronczak-profile/)
