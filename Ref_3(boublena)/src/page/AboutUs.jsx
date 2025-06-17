import React, { useEffect, useState } from 'react';
import { useAboutDataQuery } from '../store/service/AboutService';

const AboutUs = () => {
    const { data: details, isLoading, isError } = useAboutDataQuery();
    const [localData, setLocalData] = useState(() => {
        const savedData = localStorage.getItem('aboutData');
        return savedData ? JSON.parse(savedData) : null;
    });

    useEffect(() => {
        if (details) {
            localStorage.setItem('aboutData', JSON.stringify(details));
            setLocalData(details);
        }
    }, [details]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading && !localData) return <div>Loading...</div>;
    if (isError && !localData) return <div>Error loading data</div>;

    const dataToDisplay = details || localData;

    return (
        <>
            {dataToDisplay?.status && dataToDisplay?.data?.map((item, index) => {
                const services = item.services.split(',');
                const equipment = item.equipment.split(',');
                const chunkSize = equipment ? 2 : 6;

                const splitIntoChunks = (array, chunkSize) => {
                    const chunks = [];
                    for (let i = 0; i < array.length; i += chunkSize) {
                        chunks.push(array.slice(i, i + chunkSize));
                    }
                    return chunks;
                };

                const serviceChunks = splitIntoChunks(services, chunkSize);
                const equipmentChunks = splitIntoChunks(equipment, chunkSize);

                return (
                    <div className='bg-[#fff]' key={index}>
                        <div className='about_us about_section'>
                            <div className="container page_width about_container ">
                                <h1 className='about_heading'>About</h1>
                            </div>
                        </div>
                        <section className='bg-white pb-5'>
                            <div className='container page_width creative_text'>
                                <p className='text-xl text-center leading-[1.8]'>{item.top_heading}</p>
                            </div>
                            <div className='container mx-auto px-12'>
                                <h1 className='mt-6 x-lg-0'><u>Services</u></h1>
                                <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 pt-lg-8 pt-3">
                                    {serviceChunks.map((serviceChunk, chunkIndex) => (
                                        <ul key={chunkIndex} className='ps-lg-5 text-xl'>
                                            {serviceChunk.map((service, i) => (
                                                <li key={i} className='text-xl pb-2 list-disc'>{service}</li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>
                            <div className="container mx-auto px-12">
                                <div className="equipment_heading">
                                    <h1><u>Equipment</u></h1>
                                </div>
                                <div className='equipment_box grid grid-cols-2 sm:grid-cols-1 pt-lg-8'>
                                    {equipmentChunks.map((equipmentChunk, chunkIndex) => (
                                        <ul key={chunkIndex} className='ps-lg-5 text-xl'>
                                            {equipmentChunk.map((equipment, i) => (
                                                <li key={i} className='text-xl pb-2 list-disc'>{equipment}</li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        </section>
                        <section className='founder_section'>
                            <div className='container page_width'>
                                <div className="founder_heading">
                                    <h1><u>Founder</u></h1>
                                    <p className='text-xl krystina'>{item.second_sub_heading}</p>
                                </div>
                                <div className="sm:columns-1 lg:columns-1 columns-2 about_layout gap-5">
                                    <div className='pt-8'>
                                        <img src={`${item.founder_image}`} alt="owner_image" />
                                    </div>
                                    <div className='text-center pt-8'>
                                        <p className='text-white text-xl leading-[1.8] whitespace-pre-wrap'>{item.big_paragraph}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                );
            })}
        </>
    );
};

export default AboutUs;
