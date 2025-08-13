import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Xbox = () => {
  const [noticias, setNoticias] = useState([]);
  
  const juegosPopulares = [
    {
      id: 1,
      nombre: "Halo Infinite",
      imagen: "https://tse2.mm.bing.net/th/id/OIP.HUAwS7DHPrbzgCImEPg7FQHaHa?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
      url: "https://www.xbox.com/es-ES/games/halo-infinite"
    },
    {
      id: 2,
      nombre: "Forza Horizon 5",
      imagen: "https://th.bing.com/th/id/R.27d9f59aff9f14d94146a2e21bd45b91?rik=qVcewZT2VO52aA&pid=ImgRaw&r=0",
      url: "https://www.xbox.com/es-ES/games/forza-horizon-5"
    },
    {
      id: 3,
      nombre: "Starfield",
      imagen: "https://th.bing.com/th/id/R.7180208c70feac7700525d37047af8bc?rik=eQyKKqzWvVrUmA&pid=ImgRaw&r=0",
      url: "https://www.xbox.com/es-ES/games/starfield"
    },
    {
      id: 4,
      nombre: "Gears 5",
      imagen: "https://assets.xboxservices.com/assets/a5/d4/a5d4884a-ae18-4455-9c6a-174cd6a081f2.jpg?n=Gears-5_GLP-Page-Hero-1084_2020_1920x1080_04.jpg",
      url: "https://www.xbox.com/es-ES/games/gears-5"
    },
    {
      id: 5,
      nombre: "Sea of Thieves",
      imagen: "https://thf.bing.com/th?id=OIF.OVrI%2bvaA5EZYo4EzhwNpMg&cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
      url: "https://www.xbox.com/es-ES/games/sea-of-thieves"
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
      { id: 1, titulo: "Xbox Game Pass añade 5 nuevos juegos este mes", fecha: "Hace 3 horas", url: "https://news.xbox.com/es-latam/" },
      { id: 2, titulo: "Actualización de sistema mejora rendimiento en Series X", fecha: "Ayer", url: "https://news.xbox.com/es-latam/" },
      { id: 3, titulo: "Nuevo estudio de adquisición anunciado por Microsoft", fecha: "Hace 2 días", url: "https://news.xbox.com/es-latam/" }
    ];
    
    setNoticias(noticiasIniciales);
    
    const interval = setInterval(() => {
      if (noticias.length > 0) {
        const nuevaNoticia = {
          id: noticias.length + 1,
          titulo: `Actualización ${noticias.length + 1} - Nuevas ofertas en Xbox Store`,
          fecha: "Recién actualizado"
        };
        setNoticias(prev => [nuevaNoticia, ...prev.slice(0, 4)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [noticias.length]);

  // Filtrar noticias que incluyan "Xbox" en el título (no sensible a mayúsculas)
  const noticiasFiltradas = noticias.filter(noticia => noticia.titulo.toLowerCase().includes('xbox'));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #107c10 0%, #0a4d0a 100%)',
      color: 'white',
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
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>Xbox News</h1>
      {/* Sección de Noticias filtradas */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#9bf00b',
          borderBottom: '2px solid #9bf00b',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}>Últimas Noticias</h2>
        <div>
          {noticiasFiltradas.length === 0 ? (
            <div style={{color:'#c0ff72', textAlign:'center'}}>No hay noticias de Xbox.</div>
          ) : (
            noticiasFiltradas.slice(0, Math.max(3, noticiasFiltradas.length)).map(noticia => (
              <div key={noticia.id} style={{
                background: 'rgba(16, 124, 16, 0.2)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                transition: 'transform 0.3s ease',
                borderLeft: '4px solid #107c10'
              }}>
                <h3>
                  <a href={noticia.url} target="_blank" rel="noopener noreferrer" style={{ color: '#107c10', textDecoration: 'underline' }}>
                    {noticia.titulo}
                  </a>
                </h3>
                <span style={{color: '#c0ff72', fontSize: '0.85rem'}}>{noticia.fecha}</span>
              </div>
            ))
          )}
          
        </div>
      </div>
      {/* Carrusel de Juegos Destacados */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#107c10',
          textAlign: 'center',
          marginBottom: '25px',
          fontSize: '1.8rem',
          backgroundColor: '#9bf00b',
          padding: '8px',
          borderRadius: '8px'
        }}>Juegos Destacados</h2>
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
                    border: '3px solid #9bf00b',
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

export default Xbox;