# 📌 Project Introduction – Bizerte Bridge Maintenance Prediction

This project focuses on predictive maintenance for the **Bizerte Bridge**, leveraging real-time sensor data and machine learning to ensure structural safety and efficient upkeep.

---

## 🎯 Objective

We developed an intelligent monitoring and prediction system to support timely and appropriate maintenance actions. The project uses environmental and structural sensor data to predict:

- 🛠️ **MaintenanceType** – the category of maintenance needed (e.g., mechanical, structural)  
- 🧰 **MaintenanceName** – the specific component or issue (e.g., cable tension, bearing damage)  
- ⏰ **MaintenanceTime** – the expected time or urgency for intervention  

---

## 🤖 Machine Learning Models

Three separate ML models were developed:

- **Model 1:** Predicts the `MaintenanceType`  
- **Model 2:** Predicts the `MaintenanceName`  
- **Model 3:** Predicts the `MaintenanceTime`  

Each model is trained on a carefully labeled dataset with diverse features extracted from real-time bridge monitoring.

---

## 📊 Dataset Features

The dataset used for model training and prediction includes the following features:

- `Timestamp`  
- `Strain`  
- `CumulativeStrain`  
- `Temperature`  
- `Humidity`  
- `VibrationFrequency`  
- `VibrationAmplitude`  
- `Load`  
- `Displacement`  
- `BarometricPressure`  
- `UVRadiation`  
- `WaterLevel`  
- `FlowSpeed`  
- `NoiseLevel`  
- `MaintenanceType`  
- `MaintenanceName`  
- `MaintenanceTime`  

---

## 👥 User Roles & Privileges

The system includes three user roles, each with specific responsibilities and access levels:

### 🔒 Super Admin

- ✅ Full system access  
- 🔁 Can turn sensors **on/off**  
- 📊 Can view **real-time and historical** sensor data  
- 🧠 Can **run machine learning models**  
- 🗂️ Can assign tasks to **Admins and Workers**  
- ✔️ Can view all **maintenance jobs** (pending and completed)  

### 👨‍💼 Admin

- 📊 Can view **real-time and historical** sensor data  
- 🧠 Can **run machine learning models**  
- 🗂️ Can assign tasks to **Workers**  
- ✔️ Can view all **maintenance jobs**  
- 🚫 Cannot control sensors (on/off)  

### 👷 Worker

- 📋 Can view **assigned jobs**  
- ✅ Can mark jobs as **completed** by checking a confirmation box  
- 🚫 Cannot run models or assign tasks  
- 🚫 Cannot view global system or sensor status  
