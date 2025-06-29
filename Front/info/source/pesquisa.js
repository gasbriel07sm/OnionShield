document.addEventListener("DOMContentLoaded", () => {
  const chartData = [
    {
      id: "chart-1",
      label: "Sua idade",
      type: "bar",
      data: [6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 6.1, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 9.1, 6.1, 6.1, 6.1, 3.0, 3.0, 3.0],
      labels: [ "18 anos", "20 anos", "21 anos", "26 anos", "28 anos", "30 anos", "31 anos", "32 anos", "36 anos", "38 anos", "46 anos","46 anos"],
      colors: ["#2ecc71"]
    },
    {
      id: "chart-2", 
      label: "Escolaridade",
      type: "pie",
      data: [8.2, 27.3, 39.3, 24.2, 0],
      labels: ["Pós-graduação", "Ensino Médio", "Ensino Superior Incompleto", "Ensino Superior Completo", "Ensino Fundamental"],
      colors: ["#9b59b6", "#e74c3c", "#f39c12", "#2ecc71", "#3498db"]
    },
    {
      id: "chart-3",
      label: "Você trabalha ou já trabalhou com tecnologia?", 
      type: "pie",
      data: [78.8, 21.2],
      labels: ["Sim", "Não"],
      colors: ["#3498db", "#e74c3c"]
    },
    {
      id: "chart-4",
      label: "Com que frequência você usa a internet?",
      type: "pie",
      data: [100, 0, 0],
      labels: ["Todos os dias", "Algumas vezes por semana", "Raramente"],
      colors: ["#3498db", "#e74c3c", "#f39c12"]
    },
    {
      id: "chart-5",
      label: "Quais dispositivos você usa para acessar a internet?",
      type: "bar",
      data: [93.9, 84.8, 9.1, 3.0],
      labels: ["Celular", "Computador", "Tablet", "Outros"],
      colors: ["#2ecc71", "#2ecc71", "#2ecc71", "#2ecc71"]
    },
    {
      id: "chart-6",
      label: "Você costuma usar senhas diferentes para cada serviço online?",
      type: "pie", 
      data: [75.8, 24.2, 0],
      labels: ["Sim", "Não", "Não sei"],
      colors: ["#3498db", "#e74c3c", "#f39c12"]
    },
    {
      id: "chart-7",
      label: "Você sabe o que é malware?",
      type: "pie",
      data: [75, 25],
      labels: ["Sim", "Não"],
      colors: ["#4a90e2", "#f39c12"]
    },
    {
      id: "chart-8", 
      label: "Você sabe o que é phishing?",
      type: "pie",
      data: [70, 30],
      labels: ["Sim", "Não"],
      colors: ["#4a90e2", "#e74c3c"]
    },
    {
      id: "chart-9",
      label: "Você usa antivírus?", 
      type: "pie",
      data: [85, 15],
      labels: ["Sim", "Não"],
      colors: ["#f39c12", "#4a90e2"]
    },
    {
      id: "chart-10",
      label: "Já ouviu falar em autenticação de dois fatores (2FA)?",
      type: "pie",
      data: [72.7, 6.1, 21.2],
      labels: ["Sim, e utilizo", "Sim, mas não utilizo", "Não conheço"],
      colors: ["#3498db", "#e74c3c", "#f39c12"]
    },
    {
      id: "chart-11",
      label: "Você conhece os tipos de ataques?",
      type: "pie",
      data: [25, 35, 20, 10, 10],
      labels: ["Malware", "Phishing", "Ransomware", "DDoS", "Outros"],
      colors: ["#8e44ad", "#2ecc71", "#e74c3c", "#f39c12", "#34495e"]
    },
    {
      id: "chart-12",
      label: "Onde você costuma buscar informações sobre como se proteger online?",
      type: "pie",
      data: [18.2, 36.4, 12.1, 15.2, 18.2],
      labels: ["Redes sociais", "Sites de notícias", "Amigos/familiares", "Não busco", "Outros"],
      colors: ["#3498db", "#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"]
    }
  ];

  // Opções para gráficos de pizza
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { 
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  // Opções para gráficos de barra
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      }
    }
  };

  // Criar os gráficos
  chartData.forEach(({ id, label, type, data, labels, colors }) => {
    const canvas = document.getElementById(id);
    if (canvas) {
      const ctx = canvas.getContext("2d");
      
      const chartConfig = {
        type: type,
        data: {
          labels,
          datasets: [{
            label,
            data,
            backgroundColor: type === "bar" ? colors[0] : colors,
            borderWidth: 2,
            borderColor: "#fff"
          }]
        },
        options: type === "pie" ? pieOptions : barOptions
      };

      new Chart(ctx, chartConfig);
    }
  });
});