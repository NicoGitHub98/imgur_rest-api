import React, { useState } from 'react';
import { loadImages, loadImage } from '@/lib/api';
import styles from './styles.module.scss'

export async function getStaticPaths() {
    let images = [], error = null;
    try {
        images = await loadImages();
    } catch (err) {
        error = err;
    }
    const paths = images.map((img: any) => ({
        params: { id: img.id },
    }))
    return { paths, fallback: 'blocking' }
}

export async function getStaticProps(props: any) {
    const params = props.params;
    const image = await loadImage(params.id)
  
    return { 
      props: { ...image },
      revalidate: 60, 
    }
  }

export default function Image(props: any) {
    const {
        id,
        title,
        description,
        url,
        upvotes,
        downvotes,
        score,
        width
    } = props
    return (
      <main className='m-auto p-2'>
        <div className={`${styles.card} mx-auto mt-2 rounded`}>
          <img src={url} width={width} />
          <div className='p-2'>
            <p>Title: {title || 'No title'}</p>
            <p>Description: {description || 'No Description'}</p>
            <p>Upvotes: {upvotes || 0}</p>
            <p>Downvotes: {downvotes || 0}</p>
            <p>Score: {score || 0}</p>
          </div>
        </div>
      </main>
    )
  }