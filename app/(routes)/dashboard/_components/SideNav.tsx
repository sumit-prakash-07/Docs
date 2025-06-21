"use client"
import React, { useContext, useEffect, useState } from 'react'
import SideNavTopSection, { TEAM } from './SideNavTopSection'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import SideNavBotSection from './SideNavBotSection';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { FileListContext } from '@/app/_context/FileListContext';


function SideNav() {
  const {user}:any = useKindeBrowserClient();
  const createFile = useMutation(api.files.createFile);
  const [activeTeam,setActiveTeam] = useState<TEAM>();
  const convex = useConvex();
  const [totalFiles,setTotalFiles] = useState<Number>()
  const {fileList_,setFileList_} = useContext(FileListContext)
  useEffect(()=>{
    activeTeam && getFiles();
  },[activeTeam])
  const onFileCreate=(fileName:string)=>{
    createFile({
      fileName:fileName,
      teamId:activeTeam?._id,
      createdBy:user?.email,
      archive:false,
      document:"",
      whiteboard:""
    }).then(res=>{
      if(res){
        toast('File created successfully')
        getFiles();
      }
    },(e)=>{
      toast('Error while creating file')
    })
  }

  const getFiles = async()=>{
    const result = await convex.query(api.files.getFiles,{teamId:activeTeam?._id})
    setFileList_(result);
    setTotalFiles(result?.length)
  }
  return (
    <div className='h-screen fixed w-72 border-r border-[1px] p-6 flex flex-col'>
      <div className='flex-1'>
          <SideNavTopSection user={user}
          setActiveTeamInfo={(activeTeam:TEAM)=>setActiveTeam(activeTeam)}/>
      </div>
  
      <div>
        <SideNavBotSection
        totalFiles={totalFiles}
        onFileCreate={onFileCreate}
        />
      </div>
    </div>
  )
}

export default SideNav