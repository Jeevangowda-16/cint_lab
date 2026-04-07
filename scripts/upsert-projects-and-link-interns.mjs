import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

const projects = [
  {
    id: "gma-project",
    title: "GMA Project",
    slug: "gma-project",
    summary: "General Movements Assessment for early cerebral palsy detection from simple crib videos.",
    description:
      "The GMA project analyzes subtle infant movement patterns around three months old to detect risk before symptoms appear. The goal is to turn short crib videos into a practical early screening signal for clinicians and caregivers.",
    status: "ongoing",
    sortOrder: 1,
    tags: ["Clinical AI", "Computer Vision", "Pediatric Screening"],
    internRoles:
      "Help with video annotation, model tuning, pipeline testing, or backend improvements for the analysis workflow.",
    sections: [
      {
        title: "Project Goal",
        paragraphs: [
          "Catch cerebral palsy risks early so therapy can begin sooner and outcomes improve.",
          "Videos are categorized into normal, poor, cramped, or chaotic movement patterns and scored automatically by AI.",
        ],
      },
      {
        title: "How It Works",
        bullets: [
          "Record short infant videos without special gear.",
          "Use YOLO pose estimation to track body points.",
          "Extract movement speed, smoothness, and temporal features.",
          "Classify risk in minutes using an ensemble of XGBoost, LightGBM, and related models.",
        ],
      },
      {
        title: "Key Achievements",
        bullets: [
          "Collected 493+ videos and annotated 36k frames, creating India’s first GMA dataset.",
          "Built the full pipeline with annotation tools, cloud upload, and FastAPI backend support.",
          "Reached 80% proof-of-concept accuracy while tuning toward a 90% target.",
          "Secured ICMR funding and flagged high-risk cases for intervention.",
        ],
      },
      {
        title: "Tech Stack",
        table: {
          columns: [
            { key: "component", label: "Component" },
            { key: "tools", label: "Tools" },
          ],
          rows: [
            { component: "Pose Detection", tools: "YOLOv8, MediaPipe" },
            { component: "ML Classifiers", tools: "XGBoost, LightGBM, Random Forest" },
            { component: "Backend", tools: "FastAPI, Docker" },
            { component: "Data", tools: "Pandas, OpenCV" },
          ],
        },
      },
      {
        title: "Current Status",
        paragraphs: [
          "The March 2026 focus is on fixing model leakage, optimizing ensembles, and preparing hospital validation.",
          "Current performance is around AUC 0.77 with roughly 80% sensitivity while the pipeline is being hardened.",
        ],
      },
      {
        title: "Intern Roles",
        paragraphs: [
          "Interns slot into data management, model development, pipeline integration, testing, and documentation depending on their skills.",
        ],
      },
      {
        title: "Project 1.1: KPA Tool",
        paragraphs: [
          "Key Performance Areas define the measurable responsibility zones for interns and team members contributing to automated cerebral palsy detection.",
        ],
        bullets: [
          "Data Management: annotate videos and frame-level motion patterns.",
          "Model Development: tune pose estimation, engineer features, and improve classifier performance.",
          "Pipeline Integration: deploy backend services and cloud uploads.",
          "Testing & Validation: run subject-wise CV, edge-case analysis, and hospital pilot checks.",
          "Documentation & Collaboration: maintain guides, weekly reports, and onboarding material.",
        ],
      },
      {
        title: "Project 1.2: GMA UI & Raspberry Pi Integration",
        paragraphs: [
          "This sub-project turns the analysis workflow into a portable device with a stand, Raspberry Pi brain, and device UI.",
        ],
        bullets: [
          "Design and fabricate the camera and sensor stand.",
          "Integrate a Raspberry Pi for capture and lightweight on-device analysis.",
          "Build a UI to start captures, monitor status, and view results in real time.",
        ],
      },
      {
        title: "Project 1.3: VRT App",
        paragraphs: [
          "The VRT pipeline manages video capture and annotation and later supports encrypted live streaming for remote monitoring.",
        ],
        bullets: [
          "VRT supports specialized video annotation and data expansion.",
          "VTR Phase 1 covers initial deployment of the recording and annotation interface.",
          "VTR Phase 2 targets live encrypted video streams for secure monitoring.",
        ],
      },
    ],
  },
  {
    id: "biomechanics-future-initiatives",
    title: "Biomechanics & Future Initiatives",
    slug: "biomechanics-future-initiatives",
    summary: "Biomechanical movement analysis focused on foot-ankle dynamics, gait, and future sensory-motor systems.",
    description:
      "This project stream studies lower-body mechanics, especially gait and foot-ankle dynamics, and defines the roadmap for future diagnostics and training tools.",
    status: "review",
    sortOrder: 2,
    tags: ["Biomechanics", "Gait Analysis", "Sensors"],
    internRoles:
      "Support signal processing, sensor validation, movement analysis, and documentation for the roadmap and pilot studies.",
    sections: [
      {
        title: "Current Focus",
        paragraphs: [
          "The current emphasis is on understanding the intricate mechanics of the foot and ankle complex during walking.",
          "The team is developing methods such as PCA on sensor data to classify different foot types and improve feedback from in-shoe pressure sensors.",
        ],
      },
      {
        title: "Future Sub-Projects",
        bullets: [
          "Gait Signature Analysis for walk-based identification and diagnosis.",
          "Sensorimotor Coupling to study how sensory input and movement output interact.",
          "Virtual Reality Integration for immersive training environments.",
          "Balance Assessment for static and dynamic balance testing.",
        ],
      },
    ],
  },
  {
    id: "pose-correction-app",
    title: "Pose Correction App",
    slug: "pose-correction-app",
    summary: "Real-time skeletal tracking and form correction for rehabilitation and fitness.",
    description:
      "This vertical focuses on converting pose tracking and correction logic into a fast native mobile experience with stable overlays and low-latency feedback.",
    status: "ongoing",
    sortOrder: 3,
    tags: ["Mobile AI", "Pose Estimation", "Rehab Tech"],
    internRoles:
      "Help with exercise labeling, motion logic, jitter reduction, and performance testing on mobile devices.",
    sections: [
      {
        title: "Architecture Migration",
        paragraphs: [
          "The stack is transitioning from Python-based ML repositories to a native Kotlin mobile application.",
          "The goal is to keep the core logic local and responsive while improving performance and deployment stability.",
        ],
      },
      {
        title: "Performance Goals",
        bullets: [
          "Target seamless 30+ FPS on mobile devices.",
          "Deliver real-time feedback without lag.",
          "Support stable skeletal overlays during high-speed movements.",
        ],
      },
      {
        title: "Exercise Intelligence",
        bullets: [
          "Cover roughly 20 to 30 exercises with specialized correction logic.",
          "Analyze joint angles and body alignment.",
          "Reduce jitter for accurate overlays and feedback.",
        ],
      },
    ],
  },
  {
    id: "prame-yoga-breathing-app",
    title: "Prame (Yoga & Breathing) App",
    slug: "prame-yoga-breathing-app",
    summary: "A wellness app dedicated to yoga and breathing exercises.",
    description:
      "Prame is a separate wellness-focused product centered on mindfulness, breathing control, and yoga flows rather than clinical tracking.",
    status: "ongoing",
    sortOrder: 4,
    tags: ["Wellness", "Yoga", "Breathing"],
    internRoles:
      "Support user flows, guided-session content, wellness tracking, and UI refinement for the app experience.",
    sections: [
      {
        title: "Functional Focus",
        paragraphs: [
          "This project is strictly separate from the GMA and pose correction modules.",
          "It focuses on yoga and breathing exercises with a holistic approach to mindfulness and respiratory control.",
        ],
      },
    ],
  },
  {
    id: "generative-media-visualization-iga",
    title: "Generative Media & Visualization (IGA)",
    slug: "generative-media-visualization-iga",
    summary: "Generative AI for synthetic data support and high-fidelity movement visualization.",
    description:
      "IGA explores synthetic media, video generation, and advanced visualization systems to support feature extraction and research workflows.",
    status: "ongoing",
    sortOrder: 5,
    tags: ["Generative AI", "Visualization", "Synthetic Data"],
    internRoles:
      "Help with synthetic data generation, visualization pipelines, prompt experimentation, and video-generation tooling.",
    sections: [
      {
        title: "Focus Areas",
        bullets: [
          "Image generation to support synthetic data augmentation.",
          "Video generation with ComfyUI for research-grade media production.",
          "VGA visualization modules for movement-centric analytics.",
        ],
      },
    ],
  },
  {
    id: "vedio-generation-platform",
    title: "Vedio Generation Platform",
    slug: "vedio-generation-platform",
    summary: "A private video generation platform handled under Dhruv.",
    description:
      "This private project is tracked separately and is handled under Dhruv. Public-facing details are intentionally minimal.",
    status: "review",
    sortOrder: 6,
    tags: ["Private", "Video Generation"],
    internRoles: "Project access is restricted and not exposed publicly.",
    sections: [
      {
        title: "Project Scope",
        paragraphs: ["Private project handled under Dhruv."],
      },
    ],
  },
];

const projectIdByInternProject = {
  "GMA Project": "gma-project",
  "Pose Correction App": "pose-correction-app",
  "Prame (Yoga & Breathing) App": "prame-yoga-breathing-app",
  "Generative Media & Visualization (IGA)": "generative-media-visualization-iga",
  "Biomechanics & Future Initiatives": "biomechanics-future-initiatives",
  "Vedio Generation Platform": "vedio-generation-platform",
};

function normalizeUrl(value) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

async function seedProjects() {
  for (const project of projects) {
    const { id, ...payload } = project;
    await db.collection("projects").doc(id).set(
      {
        ...payload,
        id,
        updatedAt: timestamp,
        createdAt: timestamp,
      },
      { merge: true }
    );
    console.log(`Upserted projects/${id}`);
  }
}

async function linkInternsToProjects() {
  const snapshot = await db.collection("interns").get();

  for (const internDoc of snapshot.docs) {
    const data = internDoc.data();
    const projectId = projectIdByInternProject[data.project];

    await internDoc.ref.set(
      {
        projectId: projectId || data.projectId || "",
        project: data.project || "",
        program: data.program || data.project || "",
        github: normalizeUrl(data.github),
        linkedin: normalizeUrl(data.linkedin),
        updatedAt: timestamp,
      },
      { merge: true }
    );

    console.log(`Linked interns/${internDoc.id} -> ${projectId || "unassigned"}`);
  }
}

async function run() {
  await seedProjects();
  await linkInternsToProjects();
  console.log("Project seed and intern linking complete.");
}

run().catch((error) => {
  console.error("Failed to seed projects:", error.message || error);
  process.exit(1);
});
