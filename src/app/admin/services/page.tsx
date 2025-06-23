// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"
// import React, { useState} from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription 
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { 
//   PlusCircle, 
//   Trash2, 
//   Edit,
//   ArrowRight
// } from 'lucide-react';

// const ServicesAdminDashboard = () => {
//   const [services, setServices] = useState([
//     {
//       id: 1,
//       title: "Frontend Development",
//       icon: "🖥️",
//       description: "Building responsive and interactive user interfaces",
//       services: [
//         "React applications", 
//         "Vue.js development", 
//         "Responsive design"
//       ]
//     },
//     {
//       id: 2,
//       title: "Backend Development",
//       icon: "⚙️",
//       description: "Server-side logic and database management",
//       services: [
//         "RESTful APIs", 
//         "Node.js applications", 
//         "Database design"
//       ]
//     },
//     {
//       id: 3,
//       title: "DevOps & Deployment",
//       icon: "🚀",
//       description: "Infrastructure management and CI/CD pipelines",
//       services: [
//         "Docker containers", 
//         "Cloud deployment", 
//         "CI/CD setup"
//       ]
//     }
//   ]);
  
//   const [newService, setNewService] = useState({
//     title: "",
//     icon: "",
//     description: "",
//     services: [""]
//   });
  
//   const [editingId, setEditingId] = useState<number | null>(null);



//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewService(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle service item changes
//   const handleServiceItemChange = (index: number, value: string) => {
//     const updatedServices = [...newService.services];
//     updatedServices[index] = value;
//     setNewService(prev => ({ ...prev, services: updatedServices }));
//   };

//   // Add a new service item
//   const addServiceItem = () => {
//     setNewService(prev => ({ ...prev, services: [...prev.services, ""] }));
//   };

//   // Remove a service item
//   const removeServiceItem = (index: number) => {
//     if (newService.services.length > 1) {
//       const updatedServices = [...newService.services];
//       updatedServices.splice(index, 1);
//       setNewService(prev => ({ ...prev, services: updatedServices }));
//     }
//   };

//   // Submit new service
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (editingId !== null) {
//       // Update existing service
//       setServices(prev => 
//         prev.map(service => 
//           service.id === editingId ? { ...newService, id: editingId } : service
//         )
//       );
//       setEditingId(null);
//     } else {
//       // Add new service
//       const serviceToAdd = {
//         ...newService,
//         id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1
//       };
//       setServices(prev => [...prev, serviceToAdd]);
//     }
    
//     // Reset form
//     setNewService({
//       title: "",
//       icon: "",
//       description: "",
//       services: [""]
//     });
//   };

 
//   const handleEdit = (service: any) => {
//     setNewService(service);
//     setEditingId(service.id);
//   };

//   // Delete service
//   const handleDelete = (id: number) => {
//     setServices(prev => prev.filter(service => service.id !== id));
//     if (editingId === id) {
//       setEditingId(null);
//       setNewService({
//         title: "",
//         icon: "",
//         description: "",
//         services: [""]
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#E0E0E0]  dark:bg-[#121212] p-10 transition-colors duration-300">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Services Dashboard</h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Manage your full-stack development services
//             </p>
//           </div>
          
        
//         </header>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <Card className="dark:bg-gray-800">
//             <CardHeader>
//               <CardTitle className="flex text-[#121212] dark:text-[#E0E0E0] items-center">
//                 {editingId ? (
//                   <>
//                     <Edit className="h-5 w-5 mr-2" />
//                     Edit Service
//                   </>
//                 ) : (
//                   <>
//                     <PlusCircle className="h-5 w-5 mr-2" />
//                     Add New Service
//                   </>
//                 )}
//               </CardTitle>
//               <CardDescription className='text-gray-500'>
//                 {editingId 
//                   ? "Update the selected service" 
//                   : "Add a new service to your offerings"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6 text-[#121212] dark:text-[#E0E0E0]">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Service Title</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     value={newService.title}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Frontend Development"
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="icon">Icon</Label>
//                   <Input
//                     id="icon"
//                     name="icon"
//                     value={newService.icon}
//                     onChange={handleInputChange}
//                     placeholder="e.g., 🖥️"
//                     required
//                   />
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Use emoji or icon code
//                   </p>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Input
//                     id="description"
//                     name="description"
//                     value={newService.description}
//                     onChange={handleInputChange}
//                     placeholder="Short description of the service"
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <Label>Service Items</Label>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       size="sm"
//                       onClick={addServiceItem}
//                     >
//                       <PlusCircle className="h-4 w-4 mr-2" />
//                       Add Item
//                     </Button>
//                   </div>
                  
//                   {newService.services.map((item, index) => (
//                     <div key={index} className="flex items-center space-x-2">
//                       <Input
//                         value={item}
//                         onChange={(e) => handleServiceItemChange(index, e.target.value)}
//                         placeholder={`Service item ${index + 1}`}
//                         required
//                       />
//                       <Button
//                         type="button"
//                         variant="destructive"
//                         size="icon"
//                         onClick={() => removeServiceItem(index)}
//                         disabled={newService.services.length <= 1}
//                       >
//                         <Trash2 className="h-4 w-4 text-[#121212] dark:text-[#E0E0E0]" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="flex justify-end pt-4">
//                   {editingId && (
//                     <Button 
//                       type="button"
//                       variant="outline"
//                       className="mr-2"
//                       onClick={() => {
//                         setEditingId(null);
//                         setNewService({
//                           title: "",
//                           icon: "",
//                           description: "",
//                           services: [""]
//                         });
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                   )}
//                   <Button type="submit" className='bg-gray-500 dark:bg-gray-700 cursor-pointer'>
//                     {editingId ? "Update Service" : "Add Service"}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
          
//           {/* Services List */}
//           <div>
//             <Card className="dark:bg-gray-800 text-gray-500 dark:text-gray-400">
//               <CardHeader>
//                 <CardTitle>Your Services</CardTitle>
//                 <CardDescription>
//                   {services.length} services available
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {services.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
//                     <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
//                       No services yet
//                     </h3>
//                     <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                       Add your first service to get started
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-4">
//                     {services.map(service => (
//                       <Card 
//                         key={service.id} 
//                         className={`relative overflow-hidden dark:bg-gray-700 ${
//                           editingId === service.id ? "ring-2 ring-blue-500" : ""
//                         }`}
//                       >
//                         <CardContent className="p-6">
//                           <div className="flex justify-between items-start">
//                             <div className="flex items-start space-x-4">
//                               <div className="text-3xl bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
//                                 {service.icon}
//                               </div>
//                               <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                                   {service.title}
//                                 </h3>
//                                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                                   {service.description}
//                                 </p>
//                                 <ul className="mt-3 space-y-1">
//                                   {service.services.map((item, idx) => (
//                                     <li key={idx} className="flex items-center">
//                                       <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
//                                       <span className="text-gray-700 dark:text-gray-300 text-sm">
//                                         {item}
//                                       </span>
//                                     </li>
//                                   ))}
//                                 </ul>
//                               </div>
//                             </div>
                            
//                             <div className="flex space-x-2">
//                               <Button 
//                                 variant="outline" 
//                                 size="icon"
//                                 onClick={() => handleEdit(service)}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                               <Button 
//                                 variant="destructive" 
//                                 size="icon"
//                                 onClick={() => handleDelete(service.id)}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServicesAdminDashboard;
import ServicesAdminDashboard from '@/components/Admin/Services'
import React from 'react'

const page = () => {
  return (
    <div>
      <ServicesAdminDashboard/>
    </div>
  )
}

export default page
