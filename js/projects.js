// Projects page functionality
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilters = {
            search: '',
            category: 'all',
            technology: ''
        };
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
    }

    loadProjects() {
        // Sample project data - in a real application, this would come from an API
        this.projects = [
            {
                id: 'medical-imaging',
                title: 'Heart Disease Risk Analyzer',
                description: 'Machine learning system for the predictive assessment of heart disease, achieving 88.6% accuracy and providing an instantaneous risk analysis.',
                category: 'Machine Learning',
                technologies: ['Pyton', 'Pandas', 'Numpy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Streamlit'],
                image: 'https://nisargadiagnostics.com/wp-content/uploads/2024/01/Are-You-at-Risk-for-Heart-Disease.png',
                metrics: [
                    { name: 'Accuracy', value: '88.6%' },
                    // { name: 'Time Reduction', value: '60%' }
                ],
                featured: true,
                githubUrl: 'https://github.com/BIAS04/heart-risk-app',
                demoUrl: 'https://heart-risk-app-haafbaq4fzzhccp6uaftul.streamlit.app/'
            },
            
            {
                id: 'Medical_Insurance_Charge_Predictor',
                title: 'Medical Insurance Charge Predictor',
                description: 'This project builds a machine learning model to predict an individuals medical insurance costs based on personal data like age, BMI, and smoking status..',
                category: 'Machine Learning',
                technologies: ['Pyton', 'Pandas', 'Numpy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Streamlit'],
                image: 'https://storage.googleapis.com/kaggle-datasets-images/8417100/13281356/7441083d5a3845edca9436d1eb5d7c7c/dataset-cover.jpg?t=2025-10-09-16-52-36',
                metrics: [
                    { name: 'Adj R2', value: '80%' },
                    // { name: 'Latency', value: '45ms' }
                ],
                featured: true,
                githubUrl: 'https://github.com/BIAS04/Medical-Insurance-Charge-Predictor-App',
                demoUrl: 'https://medical-insurance-charge-predictor-app.streamlit.app/'
            },
            // {
            //     id: 'stock-prediction',
            //     title: 'Financial Market Prediction',
            //     description: 'LSTM-based model for predicting stock price movements using technical indicators, news sentiment, and market data with 78% directional accuracy.',
            //     category: 'time-series',
            //     technologies: ['tensorflow', 'lstm', 'pandas', 'python'],
            //     image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
            //     metrics: [
            //         { name: 'Accuracy', value: '78%' },
            //         { name: 'ROI', value: '15%' }
            //     ],
            //     featured: true,
            //     githubUrl: 'https://github.com/alexchen/stock-prediction'
            // },
            // {
            //     id: 'object-detection',
            //     title: 'Real-time Object Detection',
            //     description: 'YOLO-based system for real-time object detection in video streams, optimized for edge deployment with 30+ FPS performance.',
            //     category: 'computer-vision',
            //     technologies: ['yolo', 'opencv', 'tensorrt', 'python'],
            //     image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
            //     metrics: [
            //         { name: 'FPS', value: '35' },
            //         { name: 'mAP', value: '89.2%' }
            //     ],
            //     featured: false,
            //     githubUrl: 'https://github.com/alexchen/object-detection'
            // },
            // {
            //     id: 'chatbot',
            //     title: 'Intelligent Customer Service Bot',
            //     description: 'GPT-based conversational AI for customer service automation with context awareness and multi-turn dialogue capabilities.',
            //     category: 'nlp',
            //     technologies: ['gpt', 'transformers', 'fastapi', 'redis'],
            //     image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
            //     metrics: [
            //         { name: 'Satisfaction', value: '92%' },
            //         { name: 'Resolution Rate', value: '85%' }
            //     ],
            //     featured: false,
            //     githubUrl: 'https://github.com/alexchen/chatbot',
            //     demoUrl: 'https://chatbot-demo.example.com'
            // },
            // {
            //     id: 'recommendation-system',
            //     title: 'Personalized Recommendation Engine',
            //     description: 'Collaborative filtering and deep learning hybrid system for e-commerce product recommendations with real-time personalization.',
            //     category: 'deep-learning',
            //     technologies: ['tensorflow', 'scikit-learn', 'redis', 'kafka'],
            //     image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
            //     metrics: [
            //         { name: 'CTR Improvement', value: '23%' },
            //         { name: 'Conversion Rate', value: '+18%' }
            //     ],
            //     featured: false,
            //     githubUrl: 'https://github.com/alexchen/recommendation-system'
            // }
        ];

        this.filteredProjects = [...this.projects];
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.filterProjects();
            }, 300));
        }

        // Category filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update filter
                this.currentFilters.category = e.target.dataset.filter;
                this.filterProjects();
            });
        });

        // Technology filter
        const techFilter = document.getElementById('tech-filter');
        if (techFilter) {
            techFilter.addEventListener('change', (e) => {
                this.currentFilters.technology = e.target.value;
                this.filterProjects();
            });
        }
    }

    filterProjects() {
        this.filteredProjects = this.projects.filter(project => {
            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search;
                const searchableText = `${project.title} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Category filter
            if (this.currentFilters.category !== 'all') {
                if (project.category !== this.currentFilters.category) {
                    return false;
                }
            }

            // Technology filter
            if (this.currentFilters.technology) {
                if (!project.technologies.includes(this.currentFilters.technology)) {
                    return false;
                }
            }

            return true;
        });

        this.renderProjects();
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const noResults = document.getElementById('no-results');
        
        if (!projectsGrid) return;

        if (this.filteredProjects.length === 0) {
            projectsGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        projectsGrid.innerHTML = this.filteredProjects.map(project => 
            this.createProjectCard(project)
        ).join('');

        // Add animation to new cards
        const cards = projectsGrid.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createProjectCard(project) {
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${this.formatTechName(tech)}</span>`
        ).join('');

        const metrics = project.metrics.map(metric => 
            `<div class="metric">
                <span class="metric-value">${metric.value}</span>
                <span class="metric-label">${metric.name}</span>
            </div>`
        ).join('');

        const links = [];
        if (project.githubUrl) {
            links.push(`<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">GitHub</a>`);
        }
        if (project.demoUrl) {
            links.push(`<a href="${project.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Live Demo</a>`);
        }

        return `
            <article class="project-card ${project.featured ? 'featured' : ''}" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <a href="Project_page/project-${project.id}.html" class="btn btn-primary">View Details</a>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-category">${this.formatCategoryName(project.category)}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">${techTags}</div>
                    <div class="project-metrics">${metrics}</div>
                    ${links.length > 0 ? `<div class="project-links">${links.join('')}</div>` : ''}
                </div>
            </article>
        `;
    }

    formatCategoryName(category) {
        const categoryNames = {
            'computer-vision': 'Computer Vision',
            'nlp': 'Natural Language Processing',
            'time-series': 'Time Series',
            'deep-learning': 'Deep Learning'
        };
        return categoryNames[category] || category;
    }

    formatTechName(tech) {
        const techNames = {
            'pytorch': 'PyTorch',
            'tensorflow': 'TensorFlow',
            'opencv': 'OpenCV',
            'fastapi': 'FastAPI',
            'docker': 'Docker',
            'bert': 'BERT',
            'transformers': 'Transformers',
            'python': 'Python',
            'lstm': 'LSTM',
            'pandas': 'Pandas',
            'yolo': 'YOLO',
            'machine-learning': 'Machine Learning',
            'tensorrt': 'TensorRT',
            'gpt': 'GPT',
            'redis': 'Redis',
            'scikit-learn': 'Scikit-learn',
            'kafka': 'Kafka'
        };
        return techNames[tech] || tech.charAt(0).toUpperCase() + tech.slice(1);
    }

    // Utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('projects-grid')) {
        new ProjectsManager();
    }
});