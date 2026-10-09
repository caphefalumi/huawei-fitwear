# AI FitWear: Capstone Project Pitch & Technical Plan
**Client:** Huawei Consumer Business Group (CBG)  
**Advisor:** Dr. Khanh Dang  
**Team:** VoocTeam

---

## Client Profile & Market Context

* **Client Context:** Huawei Consumer Business Group produces phones, tablets, wearables, and HarmonyOS. Sport and health are core focus areas, placing phone-and-watch training loops directly on their product roadmap.
* **Wearables Market Leader:** Number 1 globally with 20.2% of wearable shipments in Q2 2025 (IDC). Over 200 million wearables shipped worldwide as of June 2025.
* **Ecosystem Stack:** HarmonyOS ecosystem includes over 10 million developers. Watch applications are built using ArkTS on DevEco Studio.
* **Clinical Health Focus:** Over 300 health research collaborations across 160+ medical institutions mandate strict measurement accuracy.

---

## Core Pain Points & Proposed Outcomes

### Pain Points
* **Manual Logging:** Calorie tracking apps force users to search and enter meal items manually, creating friction that leads beginner drop-off within weeks.
* **No In-Set Coaching:** Without a trainer, beginners cannot evaluate rep volume sufficiency, rest duration, or exercise execution.
* **Disconnected Devices:** Mobile phones and smartwatches rarely exchange live data during movement, leading to plan desynchronization.

### Target Outcomes
* **Automated Food Intake:** Users photograph plates to receive automated calorie, protein, carb, and fat estimates, with remaining daily allowances mirrored directly on the watch.
* **Sensor-Guided Execution:** Removes guesswork by counting reps at the wrist, automating rest intervals via vibration alerts, and presenting movement loops directly on the watch[cite: 16, 19].

---

## Core Use Cases

* **Use Case 1 (Snap a Meal):** Photograph food -> AI identifies meal items and portion sizes -> Extract Kcal, Protein, Carbs, and Fat.
* **Use Case 2 (Workout Plan Generation):** Collect height, weight, and fitness targets -> Build tailored plans across 6 muscle groups (Chest, Back, Shoulders, Legs, Arms, Abs).
* **Use Case 3 (Wrist Training):** Automatically count reps using IMU sensors, finalize sets once target reps are achieved, and signal rest completion with haptic vibrations.
* **Use Case 4 (Two-Way Sync):** Continuously synchronize calories remaining and workout progression between mobile device and watch.

---

## Technical Architecture & Pipelines

### Technology Stack
* **Mobile Client:** React Native
* **Watch Client:** ArkTS (HarmonyOS via DevEco Studio)[cite: 14, 23]
* **Backend:** Firebase (Backend-as-a-Service)

### AI Meal Analysis Pipeline
1. **Input Image:** User snaps a photo of the food plate.
2. **Segmentation:** Detect individual food items alongside a standard scaling object (ruler).
3. **Classification:** Classify food items with vision models (e.g., YOLO or MobileNet).
4. **Portion Estimation:** Convert pixel counts to real dimensions via the reference object to estimate volume and weight.
5. **Database Lookup:** Retrieve nutritional values per 100g from the food database.
6. **Nutrient Calculation:** Calculate macros using `(Nutrition per 100g * Estimated weight) / 100`.
7. **UI Presentation:** Output total estimated calories and macronutrient values to the user interface.

### Motion Analysis Pipeline (IMU + Heart Rate)
1. **Sensor Ingestion:** Gather 3-axis accelerometer, 3-axis gyroscope, and heart rate data from the watch.
2. **Signal Conditioning:** Clean signals using noise filtering (low-pass filters), calibration, normalization, and time windowing (2 to 4 seconds).
3. **Pattern Classification:** Run lightweight models (1D CNN / TCN) to classify exercise types (e.g., Bicep Curl, Shoulder Press, Squat, Bench Press).
4. **Rep Detection Logic:** Detect peaks and valleys, analyze movement phases, apply amplitude thresholds, and track minimum rep durations.
5. **Set Tracking & Alerts:** Count repetitions, trigger set completion when reaching target volume (8 to 12 reps), and run a rest timer with haptic wrist alerts.

### Edge Computing Architecture
* **Nutrition Analytics (Edge on Mobile):** Ran locally on mobile devices to eliminate API expenses, deliver rapid offline inference, and suit mass-production requirements, accepting slightly lower accuracy compared to unbounded cloud setups.
* **Motion Tracking (Edge on Watch):** Ran directly on the watch processor to maintain continuous rep counting during Bluetooth disconnections and align with smartwatch platform standards.

---

## Project Roadmap & Risk Management

### Immediate Team Milestones (October 10 Target)
* **AI Team:** Complete dataset preparation, define feature engineering methods, establish body assessment approaches, and outline automated planner logic.
* **Software Team:** Implement foundational two-way mobile-to-watch synchronization and deliver initial UI/UX designs for mobile and watch interfaces.

### Risk Strategy
* **Early Awareness:** Proactively identify ambiguities in scope, connectivity issues across devices, and size/accuracy constraints for on-device watch models.
* **Fail Fast Iteration:** Maintain concise planning intervals, review deliverables per milestone, and correct errors early[cite: 27, 28].
* **Graceful Degradation:** Use deterministic rule-based algorithms for workout generation and narrow down the supported exercise list if wrist motion recognition requires adjustment.