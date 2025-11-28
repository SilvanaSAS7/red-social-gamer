import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PlayStation = () => {
  const juegosPopulares = [
    {
      id: 1,
      nombre: "God of War Ragnarök",
      imagen: "https://cdn.wccftech.com/wp-content/uploads/2022/07/dIQGI36BxDE-HD-HD-scaled.jpg",
      url: "https://www.playstation.com/es-es/games/god-of-war-ragnarok/"
    },
    {
      id: 2,
      nombre: "Marvel's Spider-Man 2",
      imagen: "https://tse2.mm.bing.net/th/id/OIP.xEK0eiNKTtshgICHRBp44QHaEK?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
      url: "https://www.playstation.com/es-es/games/marvels-spider-man-2/"
    },
    {
      id: 3,
      nombre: "The Last of Us Part II",
      imagen: "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/itbSm3suGHSSHIpmu9CCPBRy.jpg",
      url: "https://www.playstation.com/es-es/games/the-last-of-us-part-ii/"
    },
    {
      id: 4,
      nombre: "Horizon Forbidden West",
      imagen: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/09/horizon-zero-dawn-remastered-cover-2.jpg",
      url: "https://www.playstation.com/es-es/games/horizon-forbidden-west/"
    },
    {
      id: 5,
      nombre: "Gran Turismo 7",
      imagen: "https://tse3.mm.bing.net/th/id/OIP.Bdcu1OVJRz1_7lHbrt81xAHaEK?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3",
      url: "https://www.playstation.com/es-es/games/gran-turismo-7/"
    }
  ];

  const [noticias, setNoticias] = useState([]);
  const [noticiasFiltradas, setNoticiasFiltradas] = useState([]);

  useEffect(() => {
    // Simulación de fetch de noticias (puedes reemplazar por tu API real)
    const noticiasEjemplo = [
      { id: 1, titulo: "PlayStation lanza nuevo juego exclusivo", contenido: "Detalles del lanzamiento...", url: "https://blog.playstation.com/es/", fecha: "Hace 5 horas" },
      { id: 2, titulo: "Xbox Game Pass agrega títulos", contenido: "Novedades en Xbox...", url: "https://news.xbox.com/es-latam/", fecha: "Ayer" },
      { id: 3, titulo: "PlayStation actualiza su consola", contenido: "Mejoras en hardware...", url: "https://blog.playstation.com/es/", fecha: "Hace 4 días" },
      { id: 4, titulo: "Nintendo Switch recibe actualización", contenido: "Actualización de sistema...", url: "https://www.nintendo.com/es_LA/whatsnew/", fecha: "Recién publicado" }
    ];
    setNoticias(noticiasEjemplo);
  }, []);

  useEffect(() => {
    const filtradas = noticias.filter(noticia =>
      noticia.titulo.toLowerCase().includes('playstation')
    );
    setNoticiasFiltradas(filtradas);
  }, [noticias]);

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
      }}>PlayStation News</h1>

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
        }}>Noticias recientes</h2>

        {noticiasFiltradas.length === 0 ? (
          <div style={{ color: '#8af0ff', textAlign: 'center' }}>No hay noticias de PlayStation.</div>
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
        }}>Juegos populares</h2>

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

export default PlayStation;