# SafeSphere - Team Setup Instructions

Welcome to the team! Follow these steps to get the SafeSphere Emergency Detection System running on your local machine.

## Prerequisites
- **Python 3.8+** installed.
- Internet connection (for loading icon libraries via CDN).

## Setup Process

1. **Extract the Files**
   Unzip the `SafeSphere_Hackathon_Project.zip` folder to your preferred location.

2. **Open Terminal**
   Open your terminal (PowerShell, CMD, or Bash) and navigate to the project directory:
   ```bash
   cd path/to/SafeSphere_Hackathon_Project
   ```

3. **Create a Virtual Environment (Recommended)**
   ```bash
   python -m venv venv
   ```
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the Application**
   ```bash
   cd backend
   python app.py
   ```

6. **Access the Dashboard**
   Open your browser and go to:
   [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Key Features to Test
- **Language Selection:** Appears on first launch.
- **Dual Triggers:** Test the "Accident SOS" and "Fire SOS" buttons on the dashboard.
- **Contacts Management:** Add/Edit/Delete emergency contacts.
- **Communication Tab:** Use the manual Call/Message buttons.
- **Fire Detection:** Simulated background AI logic.

## System Notes
- The database (`safesphere.db`) will be automatically initialized on the first run.
- All detections have a 10-second cancel window before alerts are "dispatched."
