import React from 'react'

type Props = {}

const UpdateCompletedTask = (props: Props) => {
  return (
    <main className='p-2'>

        <form className='flex flex-col gap-5 items-center'>
            <section className='flex flex-col md:flex-row gap-3'>
                <label>Nueva descripción:</label>
                <input type="text" />
            </section>

            <section className='flex flex-col md:flex-row gap-3'>
                <label htmlFor="">Nueva fecha de recordatorio:</label>
                {/* IMPLEMENTAR DATEPICKER ACÁ */}
                <input type="date" />
            </section>
            <button>Actualizar</button>
        </form>

    </main>
  )
}

export default UpdateCompletedTask;