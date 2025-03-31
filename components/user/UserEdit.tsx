/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Listbox } from '@headlessui/react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Slider from '@material-ui/core/Slider'
import { getCroppedImg} from './CanvasUtils'
import Image from 'next/image'
import Twitter from '../../public/images/twitter.png'
import Web from '../../public/images/web.png'
import Photo from '../../public/images/photo.png'
import useWallet from '../../hooks/useWallet'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, getUser, selectUser, selectHeroSkin, updateHeroSkin} from '../../redux/reducers/userReducer'
import classNames from '../../helpers/classNames'
import editStyle from '../../styles/useredit.module.scss'
import UserSVG from '../../public/svgs/user.svg'
import AlertSVG from '../../public/svgs/alert.svg'
import PaymentSVG from '../../public/svgs/payment.svg'
import EthIMG from '../../public/images/payment/eth.png'
import OmniIMG from '../../public/images/payment/omni.png'
import UsdcIMG from '../../public/images/payment/usdc.png'
import UsdtIMG from '../../public/images/payment/usdt.png'
import {skinNames} from '../../constants/gregSkin'

interface IUserEditProps {
  updateModal: (arg: string) => void
}

const UserEdit: React.FC<IUserEditProps> = ({updateModal}) => {
  const updateProfileFormRef = useRef<HTMLFormElement>(null)

  const DEFAULT_BANNER = 'uploads/default_banner.png'
  const DEFAULT_AVATAR = 'uploads/default_avatar.png'

  const [avatar, setAvatar] = useState(process.env.API_URL + 'uploads/default_avatar.png')
  const [gregName, setGregName] = useState(useSelector(selectHeroSkin))
  const [banner_1, setBanner_1] = useState(process.env.API_URL + DEFAULT_BANNER)
  const [banner_2, setBanner_2] = useState(process.env.API_URL + DEFAULT_BANNER)
  const [banner_3, setBanner_3] = useState(process.env.API_URL + DEFAULT_BANNER)
  const [bannerSelected, setBannerSelect] = useState(0)
  const [username, setUserName] = useState('')
  const [bio, setBio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [website, setWebsite] = useState('')
  const [selectedTab, setSelectedTab] = useState(0)

  const [cropDlgOpen, setCropDlgOpen] = useState(false)
  const [imageSrc, setImageSrc] = React.useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [coinNFTID, handleNFTCoin] = useState('0')
  const [coinTokenID, handleTokenCoin] = useState('0')

  const isGregHolder = false //useSelector(selectIsGregHolder)

  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const context = useWallet()

  useEffect(() => {
    if ( context.address != undefined ) {
      dispatch(getUser(context.address) as any)
    }
  }, [context.address])

  useEffect(() => {
    if ( user.address != undefined ) {
      setAvatar(user.avatar === undefined || user.avatar === DEFAULT_AVATAR ? '/images/default_avatar.png': (process.env.API_URL + user.avatar))
      setBanner_1(user.banners[0] === undefined || user.banners[0] === DEFAULT_BANNER ? '/images/default_banner.png' : (process.env.API_URL + user.banners[0]))
      setBanner_2(user.banners[1] === undefined || user.banners[1] === DEFAULT_BANNER ? '/images/default_banner.png' : (process.env.API_URL + user.banners[1]))
      setBanner_3(user.banners[2] === undefined || user.banners[2] === DEFAULT_BANNER ? '/images/default_banner.png' : (process.env.API_URL + user.banners[2]))
      setUserName(user.username)
      setBio(user.bio)
      setTwitter(user.twitter)
      setWebsite(user.website)
    }
  }, [user.address])

  // This function will be triggered when the file field change
  const onChangeAvatar = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0])
    }
  }
  const onChangeBanner_1 = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)

      setCropDlgOpen(true)
      setImageSrc(imageDataUrl)
      setBannerSelect(1)
    }
  }

  const onChangeBanner_2 = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)

      setCropDlgOpen(true)
      setImageSrc(imageDataUrl)
      setBannerSelect(2)
    }
  }
  const onChangeBanner_3 = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)

      setCropDlgOpen(true)
      setImageSrc(imageDataUrl)
      setBannerSelect(3)
    }
  }
  const onClickAvatar = () => {
    document.getElementById('image_avatar')?.click()
  }
  const onClickBanner_1 = () => {
    document.getElementById('image_banner_1')?.click()
  }
  const onClickBanner_2 = () => {
    document.getElementById('image_banner_2')?.click()
  }
  const onClickBanner_3 = () => {
    document.getElementById('image_banner_3')?.click()
  }

  const updateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if ( updateProfileFormRef.current !== null ) {

      const formData = new FormData(updateProfileFormRef.current)
      const address = context.address?context.address:''
      formData.append('address', address)
      formData.append('greg',gregName)      

      if ( banner_1 != process.env.API_URL + DEFAULT_BANNER && banner_1 != '/images/default_banner.png' ) {
        formData.append('banner_1', (await getFileFromUrl(banner_1, 'banner1.png')) as any)
      }
      if ( banner_2 != process.env.API_URL + DEFAULT_BANNER && banner_2 != '/images/default_banner.png' ) {
        formData.append('banner_2', (await getFileFromUrl(banner_2, 'banner2.png')) as any)
      }
      if ( banner_3 != process.env.API_URL + DEFAULT_BANNER && banner_3 != '/images/default_banner.png' ) {
        formData.append('banner_3', (await getFileFromUrl(banner_3, 'banner3.png')) as any)
      }
      dispatch(updateHeroSkin(gregName) as any)
      dispatch(updateUser(formData) as any)
      // router.push('/')
      updateModal('Micheal')
    }
  }

  const getFileFromUrl = async (url: string, name: string, defaultType = 'image/jpeg') => {
    try {
      const response = await fetch(url)
      const data = await response.blob()
      return new File([data], name, {
        type: data.type || defaultType,
      })
    } catch (err) {
      console.log('getFileFromUrl err?', err)
    }
  }

  const readFile = async (file : Blob) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result as string), false)
      reader.readAsDataURL(file)
    })
  }

  const cropDlgClose = () => {
    setCropDlgOpen(false)
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      )
      switch(bannerSelected) {
      case 1:
        setBanner_1(croppedImage as string)
        break
      case 2:
        setBanner_2(croppedImage as string)
        break
      case 3:
        setBanner_3(croppedImage as string)
        break
      }
      setCropDlgOpen(false)
    } catch (e) {
      console.error(e)
    }
  }, [imageSrc, croppedAreaPixels])

  return (
    <>
      <div className="w-full flex flex-row min-h-[750px]">
        <div className={classNames('basis-1/6', editStyle.sidemenu)}>
          <ul className='mt-[1rem]'>
            <li className={selectedTab == 0 ? classNames(editStyle.current) : ''}>
              <button onClick={() => setSelectedTab(0)} className='flex justify-start'>
                <div><UserSVG className="inline"/></div>
                <span className='ml-4'>profile</span>
              </button>
            </li>
            <li className={selectedTab == 1 ? classNames(editStyle.current) : ''}>
              <button onClick={() => setSelectedTab(1)} className='flex justify-start'>
                <div><AlertSVG className="inline"/></div>
                <span className='ml-4'>alert</span>
              </button>
            </li>
            <li className={selectedTab == 2 ? classNames(editStyle.current) : ''}>
              <button onClick={() => setSelectedTab(2)} className='flex justify-start'>
                <div><PaymentSVG className="inline"/></div>
                <span className='ml-4'>payment</span>
              </button>
            </li>
          </ul>
        </div>
        <Dialog onClose={cropDlgClose} aria-labelledby="simple-dialog-title" open={cropDlgOpen} maxWidth={'lg'}>
          <DialogTitle id="simple-dialog-title">Crop Image</DialogTitle>
          <div className="w-[800px] h-[600px]">
            <div className="relative h-[500px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropSize={{width: 800, height: 354}}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-[2rem]">
              <div className="col-span-3 px-[10%]">
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.01}
                  aria-labelledby="Zoom"
                  // classes={{ root: classes.slider }}
                  onChange={(e, z) => setZoom(z as number)}
                />
              </div>
              <div className="col-span-1">
                <button onClick={showCroppedImage} className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >Crop</button>
              </div>
            </div>
          </div>
        </Dialog>
        <div className="basis-5/6 pl-4  mt-[1rem]" style={{position: 'relative'}}>
          {
            selectedTab == 0 &&
            <form
              ref={updateProfileFormRef}
              onSubmit={updateProfile}
            >
              <input
                id="image_banner_1"
                accept="image/*"
                type="file"
                onChange={onChangeBanner_1}
                className="hidden"
              />
              <input
                id="image_banner_2"
                accept="image/*"
                type="file"
                onChange={onChangeBanner_2}
                className="hidden"
              />
              <input
                id="image_banner_3"
                accept="image/*"
                type="file"
                onChange={onChangeBanner_3}
                className="hidden"
              />
              <div className="border-gray-300 bg-[#E9ECEF] border-2 p-5 px-10">
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div>
                    <div className="border-[#B444F9] mb-5 relative cursor-pointer" onClick={onClickBanner_1}>
                      <div
                        className="absolute z-10 top-[50%] mt-[-20px] left-[50%] ml-[-20px] bg-[#E9ECEF99] rounded-full w-[40px] h-[40px] p-2"
                      >
                        <Image src={Photo} alt="photo" />
                      </div>
                      <div className="border-image">
                        <Image
                          src={(typeof banner_1 == 'string')?banner_1:URL.createObjectURL(banner_1)}
                          alt="first image1"
                          layout="responsive"
                          width={200}
                          height={100}
                        />
                      </div>
                    </div>
                    <div className="rounded-full mx-auto bg-[#B444F9] text-white center w-[47px] h-[47px] text-2xl text-center p-2">
                      1
                    </div>
                  </div>
                  <div>
                    <div className="border-[#B444F9] mb-5 relative cursor-pointer" onClick={onClickBanner_2}>
                      <div
                        className="absolute z-10 top-[50%] mt-[-20px] left-[50%] ml-[-20px] bg-[#E9ECEF99] rounded-full w-[40px] h-[40px] p-2"
                      >
                        <Image src={Photo} alt="photo" />
                      </div>
                      <div className="border-image">
                        <Image
                          src={(typeof banner_2 == 'string')?banner_2:URL.createObjectURL(banner_2)}
                          alt="first image"
                          layout="responsive"
                          width={200}
                          height={100}
                        />
                      </div>
                    </div>
                    <div className="rounded-full mx-auto bg-[#B444F9] text-white center w-[47px] h-[47px] text-2xl text-center p-2">
                      2
                    </div>
                  </div>
                  <div>
                    <div className="border-[#B444F9] mb-5 relative cursor-pointer" onClick={onClickBanner_3}>
                      <div
                        className="absolute z-10 top-[50%] mt-[-20px] left-[50%] ml-[-20px] bg-[#E9ECEF99] rounded-full w-[40px] h-[40px] p-2"
                      >
                        <Image src={Photo} alt="photo" />
                      </div>
                      <div className="border-image">
                        <Image
                          src={(typeof banner_3 == 'string')?banner_3:URL.createObjectURL(banner_3)}
                          alt="first image"
                          layout="responsive"
                          width={200}
                          height={100}
                        />
                      </div>
                    </div>
                    <div className="rounded-full mx-auto bg-[#B444F9] text-white center w-[47px] h-[47px] text-2xl text-center p-2">
                      3
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-5 w-full">
                <div>
                  <div
                    className="relative cursor-pointer"
                    onClick={onClickAvatar}
                  >
                    <div
                      className="absolute z-10 top-[50%] mt-[-20px] left-[50%] ml-[-20px] bg-[#E9ECEF99] rounded-full w-[40px] h-[40px] p-2"
                    >
                      <Image src={Photo} alt="photo" />
                    </div>
                    <Image
                      src={(typeof avatar == 'string')?avatar:URL.createObjectURL(avatar)}
                      alt="avatar"
                      width={250}
                      height={250}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <input
                  id="image_avatar"
                  accept="image/*"
                  type="file"
                  onChange={onChangeAvatar}
                  className="hidden"
                  name="avatar"
                />
                <div className="ml-7 w-full">
                  <div className="w-full flex">
                    <div className="w-full mr-[30px] ">
                      <div className="w-full mb-3">
                        <div className="text-[#6C757D]">username:</div>
                        <input
                          type="text"
                          name='username'
                          className="user-input"
                          value={username}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                      <div className="text-[#6C757D]">
                        <div>bio:</div>
                        <textarea
                          className="user-textarea w-full"
                          placeholder="(200 characters max)"
                          name='bio'
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </div>
                    </div>
                    {isGregHolder&&
                      <div>
                        <div
                          className="relative cursor-pointer"
                          onClick={onClickAvatar}
                        >
                          <img
                            src={`/images/gregs/Alien_${gregName}.png`}
                            alt="avatar"
                            className=' w-[190px]'
                          />
                        </div>
                        <Listbox value={'selected'} onChange={(val)=> {setGregName(val) } }>
                          <div className="relative z-50">
                            <Listbox.Button className="relative w-full height-[25px] cursor-default rounded-lg bg-[#E9ECEF]  pl-3 pr-10 text-lg text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 xl:text-[18px] lg:text-[14px]">
                              <span className="block truncate">{gregName}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <i className="fa fa-chevron-down"></i>
                              </span>
                            </Listbox.Button>
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#E9ECEF] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {skinNames.map((sort_item, index) => (
                                <Listbox.Option
                                  key={index}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={sort_item}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {sort_item}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                          <i className="fa fa-chevron-down h-5 w-5"></i>
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        </Listbox>
                      </div>
                    }

                  </div>

                  <div className="w-full mb-3 mt-3 flex items-center">
                    <div className="text-[#6C757D] mr-2">
                      <Image src={Twitter} alt="tiwitter" />
                    </div>
                    <input
                      type="text"
                      className="user-input"
                      name='twitter'
                      placeholder="https://"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                    />
                  </div>
                  <div className="w-full mb-5 flex items-center">
                    <div className="text-[#6C757D] mr-2">
                      <Image src={Web} alt="web" />
                    </div>
                    <input
                      type="text"
                      name="website"
                      className="user-input"
                      placeholder="https://"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 justify-end mb-5">
                <button
                  type='submit'
                  className="inline-block absolute right-[2rem] bottom-[20px] px-10 py-1 bg-[#B444F9] hover:bg-[#9557bb] text-white  font-medium text-[18px] rounded-[4px] cursor-pointer"
                >
                  save
                </button>
              </div>
            </form>
          }
          {
            selectedTab == 1 &&
            <form
              ref={updateProfileFormRef}
              onSubmit={updateProfile}
            >
              <div className="flex flex-col p-4">
                <div className='flex flex-row'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Item Sold</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>an NFT of yours is purchased</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Bids</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>a bid is placed on your NFT</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Outbid</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>a user exceeds your offer on an NFT you bid on</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Succesful Purchase</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>an NFT is succesfully bought</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className="w-[22px]"></div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Minimum Bid</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>no alerts unless bid exceeds this value:</p>

                    <span className={classNames('basis-1/6',editStyle.etherspan)}>
                      <input className="w-32 my-4" type="text" placeholder='0.005' disabled={true} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 justify-end mb-5">
                <button
                  type='submit'
                  disabled={true}
                  className="inline-block absolute right-[2rem] bottom-[20px] px-10 py-1 bg-[#B444F9] hover:bg-[#9557bb] text-white  font-medium text-[18px] rounded-[4px] disabled:bg-[#a1a1a1]"
                >
                  save
                </button>
              </div>
            </form>
          }
          {
            selectedTab == 2 &&
            <form
              ref={updateProfileFormRef}
              onSubmit={updateProfile}
            >
              <div className="flex flex-col p-4">
                <div className='flex flex-row'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Accept Credit Card Payments</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>KYC verification required</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>Set Default Token for Payments</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>preferred token is default payment option</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className='w-[22px]'></div>
                  <div className={editStyle.tokenOption}>
                    <div className={editStyle.chainIcon}>
                      {coinTokenID==='0' &&  <Image src={OmniIMG} alt='Omni logo'/>}
                      {coinTokenID==='1' &&  <Image src={UsdcIMG} alt='Usdc logo'/>}
                      {coinTokenID==='2' &&  <Image src={UsdtIMG} alt='Usdt logo'/>}
                      {coinTokenID==='3' &&  <Image src={EthIMG} alt='Eth logo'/>}
                    </div>
                    <select disabled={true} onChange={(e) => {
                      handleTokenCoin(e.target.value)
                    }}>
                      <option value={'0'}>OMNI</option>
                      <option value={'1'}>USDC</option>
                      <option value={'2'}>USDT</option>
                      <option value={'3'}>ETH</option>
                    </select>
                  </div>

                </div>
                <div className='flex flex-row my-4'>
                  <div className="flex items-center">
                    <input className="bg-[#FEFEFF] text-[#B444F9] w-[22px] h-[23px] rounded border-2 border-[#ADB5BD]" disabled={true} type="checkbox"/>
                  </div>
                  <div className="inline-block align-middle ml-4">
                    <p className='text-[#ADB5BD] text-lg leading-6 font-medium'>List Prices by Default in:</p>
                    <p className='text-[#ADB5BD] text-base leading-5'>a user exceeds your offer on an NFT you bid on</p>
                  </div>
                </div>
                <div className='flex flex-row my-4'>
                  <div className='w-[22px]'></div>
                  <div className={editStyle.tokenOption}>
                    <div className={editStyle.chainIcon}>
                      {coinNFTID==='0' &&  <Image src={OmniIMG} alt='Omni logo'/>}
                      {coinNFTID==='1' &&  <Image src={UsdcIMG} alt='Usdc logo'/>}
                      {coinNFTID==='2' &&  <Image src={UsdtIMG} alt='Usdt logo'/>}
                      {coinNFTID==='3' &&  <Image src={EthIMG} alt='Eth logo'/>}
                    </div>
                    <select disabled={true} onChange={(e) => {
                      handleNFTCoin(e.target.value)
                    }}>
                      <option value={'0'}>OMNI</option>
                      <option value={'1'}>USDC</option>
                      <option value={'2'}>USDT</option>
                      <option value={'3'}>ETH</option>
                    </select>
                  </div>

                </div>
              </div>
              <div className='flex space-x-2 justify-end mb-5'>
                <button
                  type='submit'
                  disabled={true}
                  className="inline-block absolute right-[2rem] bottom-[20px] px-10 py-1 bg-[#B444F9] hover:bg-[#9557bb] text-white  font-medium text-[18px] rounded-[4px] disabled:bg-[#a1a1a1]"
                >
                  save
                </button>
              </div>
            </form>
          }
        </div>
      </div>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_1a.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_1b.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_2a.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_2b.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_3a.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_3b.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_4a.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_4b.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_5a.png'} className=' w-[0px] hidden'/>
      <img alt={'alienIcon'} src={'/images/gregs/Alien_5b.png'} className=' w-[0px] hidden'/>

    </>
  )
}

export default UserEdit
