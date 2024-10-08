import React, { useCallback } from 'react';
import BusinessCardDisplay from './BusinessCardDisplay';
import { PiArrowBendLeftDownBold } from "react-icons/pi";
import { useAppContext } from '../AppContext';

function DisplayedOptions({ businesses }) {
  const { setIsOpen, setRestaurantLink, setIsRestaurant, setClickedBusiness } = useAppContext();

  const parseTimeToMinutes = (timeStr) => {
    let totalMinutes = 0;
    const timeParts = timeStr.split(' ');

    for (let i = 0; i < timeParts.length; i++) {
      if (timeParts[i].includes('hour')) {
        totalMinutes += parseInt(timeParts[i - 1]) * 60;
      } else if (timeParts[i].includes('min')) {
        totalMinutes += parseInt(timeParts[i - 1]);
      }
    }

    return totalMinutes;
  };

  const sortBusinessesByTravelTime = (businesses) => {
    return businesses.sort((a, b) => {
      const timeA = parseTimeToMinutes(a[0][`walk_time`]);
      const timeB = parseTimeToMinutes(b[0][`walk_time`]);
      return timeA - timeB;
    });
  };

  sortBusinessesByTravelTime(businesses, 'walk');

  const handleSetIsOpen = useCallback((value) => {
    setIsOpen(value);
  }, [setIsOpen]);

  const handleSetRestaurantLink = useCallback((link) => {
    setRestaurantLink(link);
  }, [setRestaurantLink]);

  const handleSetIsRestaurant = useCallback((value) => {
    setIsRestaurant(value);
  }, [setIsRestaurant]);

  const handleSetClickedBusiness = useCallback((business) => {
    setClickedBusiness(business);
  }, [setClickedBusiness]);

  return (
    <div className="grid grid-cols-1 gap-4 overflow-scroll max-h-[48rem] no-scrollbar ">
      <div className='flex flex-row justify-start text-xl'>
        <PiArrowBendLeftDownBold size={34} className='ml-1 mt-1' />
        <p className='ml-1'>Click to see company profile</p>
      </div>
      {businesses?.map((business, index) => (
        <BusinessCardDisplay
          key={index}
          business={business}
          setIsOpen={handleSetIsOpen}
          setRestaurantLink={handleSetRestaurantLink}
          setIsRestaurant={handleSetIsRestaurant}
          setClickedBusiness={handleSetClickedBusiness}
          index={index}
        />
      ))}
    </div>
  );
}

export default DisplayedOptions;
