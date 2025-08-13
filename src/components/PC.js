import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PC = () => {
  const [noticias, setNoticias] = useState([]);
  
  const juegosPopulares = [
    {
      id: 1,
      nombre: "Cyberpunk 2077",
      imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      url: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/"
    },
    {
      id: 2,
      nombre: "Baldur's Gate 3",
      imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
      url: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/"
    },
    {
      id: 3,
      nombre: "Counter-Strike 2",
      imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
      url: "https://store.steampowered.com/app/730/CounterStrike_2/"
    },
    {
      id: 4,
      nombre: "Elden Ring",
      imagen: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
      url: "https://store.steampowered.com/app/1245620/ELDEN_RING/"
    },
    {
      id: 5,
      nombre: "Valorant",
      imagen: "https://static.wikia.nocookie.net/valorant/images/2/2a/VALORANT_EP7_ACT_I_Key_Art.jpg",
      url: "https://playvalorant.com/"
    }
  ];

  const carruselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const noticiasIniciales = [
      { id: 1, titulo: "Nuevos drivers NVIDIA mejoran rendimiento en juegos AAA", fecha: "Hace 4 horas", url: "https://www.nvidia.com/es-la/geforce/news/" },
      { id: 2, titulo: "Steam alcanza récord de usuarios concurrentes", fecha: "Ayer", url: "https://store.steampowered.com/news/" },
      { id: 3, titulo: "Lanzamiento sorpresa de nuevo DLC para juego indie", fecha: "Hace 3 días", url: "https://store.steampowered.com/" }
    ];
    
    setNoticias(noticiasIniciales);
    
    const interval = setInterval(() => {
      if (noticias.length > 0) {
        const nuevaNoticia = {
          id: noticias.length + 1,
          titulo: `Actualización ${noticias.length + 1} - Nuevos lanzamientos en PC`,
          fecha: "Justo ahora",
          url: "https://store.steampowered.com/explore/new/"
        };
        setNoticias(prev => [nuevaNoticia, ...prev.slice(0, 4)]);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [noticias.length]);

  // Filtrar noticias que incluyan "PC" o "Steam" en el título (no sensible a mayúsculas)
  const noticiasFiltradas = noticias.filter(noticia => {
    const titulo = noticia.titulo.toLowerCase();
    return titulo.includes('pc') || titulo.includes('steam');
  });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      color: '#e0e0e0',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      <h1 style={{
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '30px',
        textShadow: '0 0 10px rgba(0, 195, 255, 0.7)'
      }}>PC Gaming News</h1>
      {/* Sección de Noticias filtradas */}
      <div style={{
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(0, 195, 255, 0.3)'
      }}>
        <h2 style={{
          color: '#00c3ff',
          borderBottom: '2px solid #00c3ff',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>Noticias Recientes</h2>
        <div>
          {noticiasFiltradas.length === 0 ? (
            <div style={{color:'#00c3ff', textAlign:'center'}}>No hay noticias de PC.</div>
          ) : (
            noticiasFiltradas.slice(0, Math.max(3, noticiasFiltradas.length)).map(noticia => (
              <div key={noticia.id} style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                transition: 'transform 0.3s ease',
                borderLeft: '4px solid #00c3ff'
              }}>
                <h3>
                  <a href={noticia.url} target="_blank" rel="noopener noreferrer" style={{ color: '#00c3ff', textDecoration: 'underline' }}>
                    {noticia.titulo}
                  </a>
                </h3>
                <span style={{color: '#00c3ff', fontSize: '0.85rem'}}>{noticia.fecha}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Carrusel de Títulos Destacados */}
      <div style={{
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        borderRadius: '12px',
        padding: '25px',
        border: '1px solid rgba(0, 195, 255, 0.3)'
      }}>
        <h2 style={{
          color: '#00c3ff',
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '1.8rem',
          textShadow: '0 0 10px rgba(0, 195, 255, 0.5)'
        }}>Títulos Destacados</h2>
        <Slider {...carruselSettings}>
          {juegosPopulares.map(juego => (
            <div key={juego.id} style={{padding: '15px', textAlign: 'center'}}>
              <a href={juego.url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: '#333'}}>
                <img 
                  src={juego.imagen}
                  alt={juego.nombre}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '3px solid #00ffea',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.4)'
                  }}
                />
                <p style={{fontWeight: 'bold', marginTop: '15px', fontSize: '1.1rem', color: '#ffffff'}}>{juego.nombre}</p>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PC;