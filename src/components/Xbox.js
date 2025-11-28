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
      background: 'linear-gradient(145deg, #1e1e2f 0%, #111122 100%)',
      color: 'white',
      padding: '35px',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      backdropFilter: 'blur(10px)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <h1 style={{
        color: '#ffffff',
        textAlign: 'center',
        fontSize: '2.8rem',
        marginBottom: '40px',
        textShadow: '0 4px 12px rgba(214, 95, 244, 1)',
        letterSpacing: '1.5px'
      }}>Xbox News</h1>

      {/* Noticias */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '18px',
        padding: '25px',
        marginBottom: '40px',
        border: '1px solid rgba(138, 240, 255, 0.2)',
        boxShadow: 'inset 0 0 20px rgba(138, 240, 255, 0.05)'
      }}>
        <h2 style={{
          color: '#c77dff',
          textAlign: 'center',
          fontSize: '1.9rem',
          borderBottom: '2px solid #c77dff',
          paddingBottom: '10px',
          marginBottom: '25px',
          letterSpacing: '1px'
        }}>Últimas Noticias</h2>

        {noticiasFiltradas.length === 0 ? (
          <div style={{ color: '#8af0ff', textAlign: 'center' }}>No hay noticias de Xbox.</div>
        ) : (
          noticiasFiltradas.slice(0, Math.max(3, noticiasFiltradas.length)).map(noticia => (
            <div key={noticia.id} style={{
              background: 'linear-gradient(90deg, rgba(138,240,255,0.15), rgba(199,125,255,0.15))',
              borderRadius: '10px',
              padding: '18px',
              marginBottom: '18px',
              borderLeft: '5px solid #c77dff',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
              <h3>
                <a href={noticia.url} target="_blank" rel="noopener noreferrer" style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>{noticia.titulo}</a>
              </h3>
              <span style={{ color: '#8af0ff', fontSize: '0.9rem' }}>{noticia.fecha}</span>
            </div>
          ))
        )}
      </div>

      {/* Carrusel de Juegos Exclusivos */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(40,40,60,0.85), rgba(25,25,45,0.95))',
        borderRadius: '20px',
        padding: '35px',
        border: '1px solid rgba(138, 240, 255, 0.1)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)'
      }}>
        <h2 style={{
          color: '#c77dff',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '2rem',
          background: 'linear-gradient(90deg, rgba(138,240,255,0.15), rgba(199,125,255,0.15))',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid rgba(138, 240, 255, 0.2)'
        }}>Juegos Destacados</h2>

        <Slider {...carruselSettings}>
          {juegosPopulares.map(juego => (
            <div key={juego.id} style={{ padding: '15px', textAlign: 'center' }}>
              <a href={juego.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#fff' }}>
                <img
                  src={juego.imagen}
                  alt={juego.nombre}
                  style={{
                    width: '100%',
                    height: '260px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    border: '2px solid #8af0ff',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = '#c77dff';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(199,125,255,0.3)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = '#8af0ff';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
                  }}
                />
                <p style={{
                  fontWeight: '600',
                  marginTop: '15px',
                  fontSize: '1.2rem',
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(138, 240, 255, 0.4)'
                }}>{juego.nombre}</p>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Xbox;
