
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

import { loadImages } from '@/lib/api';
import React, { useState } from 'react';

interface IQueryParams {
  section: string | undefined,
  sort: string | undefined,
  window: string | undefined,
  page: string | undefined,
  showViral: string | undefined,
}

export async function getServerSideProps(context: any) {
  const queryParams: IQueryParams = context.query
  const { section, sort, window, page, showViral } = queryParams
  let images = [], errorMsg = null;
  try {
    images = await loadImages(section, sort, window, parseInt(page as string), !!showViral);
  } catch (err: any) {
    errorMsg = err.message
  }
  const formValues = {
    section: section || null,
    sort: sort || null,
    window: window || null,
    page: page || null,
    showViral: showViral || null,
  }
  return {
    props: {
      formValues,
      images,
      errorMsg,
    },
  }
}

export default function Images(props: any) {
  const [section, setSection] = useState(props.formValues.section || 'hot');
  const [sort, setSort] = useState(props.formValues.sort || 'viral');
  const [window, setWindow] = useState(props.formValues.window || 'day');
  const [page, setPage] = useState(props.formValues.page || '1');
  const [showViral, setShowViral] = useState(props.formValues.showViral || false)

  return (
    <main className='m-auto'>
      {props.errorMsg ? (
        <p>{props.errorMsg}</p>
      ) : (
        <>
          <div className='bg-slate-300 sticky top-0 rounded-b'>
            <form className='flex justify-center items-center gap-3 p-5'>
              <div>
                <label htmlFor="section">Section</label>
                <select name="section" id="section" defaultValue={section} onChange={(evt) => setSection(evt.target.value)}>
                  <option value="hot">hot</option>
                  <option value="top">top</option>
                  <option value="user">user</option>
                </select>
              </div>
              <div>
                <label htmlFor="sort">Sort</label>
                <select name="sort" id="sort" defaultValue={sort}>
                  <option value="viral">viral</option>
                  <option value="top">top</option>
                  <option value="time">time</option>
                  <option value="rising" disabled={section !== 'user'}>rising</option>
                </select>
              </div>
              <div>
                <label htmlFor="window">Window</label>
                <select name="window" id="window" defaultValue={window}>
                  <option value="day">day</option>
                  <option value="week">week</option>
                  <option value="month">month</option>
                  <option value="year">year </option>
                  <option value="all">all</option>
                </select>
              </div>
              <div>
                <input type="checkbox" name="showViral" id="check" defaultChecked={!!showViral} value={'true'} />
                <label htmlFor="check">Viral Images</label>
              </div>
              <div>
                <input className={`${styles.button} p-1 rounded`} type="submit" value="Filtrar" />
              </div>
            </form>
          </div>
          <div className='container flex flex-wrap grow items-start justify-center gap-2 pt-2'>
            {props.images?.map?.((img: any) => (
              <div className='border-black shadow border-2 rounded flex flex-col' key={img.id}>
                <Link href={`/images/${img.id}`}>
                  <img
                    src={img.source}
                    alt={img.description}
                    width={250}
                  />
                </Link>
                <p className='text-center w-[250px] mt-auto border-t-2 border-black'>
                  {img.title || 'No description'}
                </p>
              </div>
            ))}
          </div>
          <div className={`${styles.pagination} text-center mt-5`}>
            <a href="#" className={page !== 1 ? 'disabled' : ''}>❮</a>
            <a href="#" className={props.images.length === 0 ? 'disabled' : ''}>❯</a>
          </div>
        </>
      )}
    </main>
  )
}