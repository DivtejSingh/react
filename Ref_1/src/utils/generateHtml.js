  export const generateFullTableHTML = (data) => {
    const roleLabel = data[0]?.role_id === 4 ? "Users" 
                  : data[0]?.role_id === 6 ? "Teachers" 
                  : "Admins";

    return `
    <h2 style="text-align:center"><b>All ${roleLabel}</b></h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; margin-top: 10px;">
        <thead>
          <tr style="background-color: #e9ecef;">
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Name</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Surname</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Contact</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Email</th>
           ${roleLabel!=="Admins"?`<th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Auth Code</th>`:""} 
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Role</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (u) => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 10px;">${u.first_name || ""}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${u.last_name || ""}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${u.phone || ""}</td>
                <td style="border: 1px solid #ccc; padding: 10px;">${u.email || ""}</td>
                ${roleLabel !== "Admins" ? `<td style="border: 1px solid #ccc; padding: 10px;">${u.authrization_code || ""}</td>` : ""}
                <td style="border: 1px solid #ccc; padding: 10px;">${u.role_name || ""}</td>
                <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">
                  ${u.is_active == 1 ? "Active" : "Inactive"}
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };


  export const generateRelativeHTML = (data,username) => {

    return `
    <h2 style="text-align:center"><b>All Relatives</b></h2>
      <h6 style="padding-left:10px"><b>Student Name</b>: ${username}</h6>  
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; margin-top: 10px;">

        <thead>
          <tr style="background-color: #e9ecef;">
            
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">User Name</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Email Id</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Contact No</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Address</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Authentication Code</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Relation</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (u) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                 
                  <span>${u?.username}</span>
                </div>
              </td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.email || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.phone || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.address || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.authrization_code || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.relationship_type || ""}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };
  
  
  // Shared styles
  export const generateFullGroupHTML = (data) => {
    return `
    <h2 style="text-align:center"><b>All Groups</b></h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; margin-top: 10px;">
        <thead>
          <tr style="background-color: #e9ecef;">
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Group Name</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Description</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Created By</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Members</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Status</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Created At</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map((u) => {
              const membersTable = `
                <table style="border-collapse: collapse; width: 100%; font-size: 11px; margin-top: 5px;">
                  <thead>
                    <tr style="background-color: #f7f7f7;">
                      <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">Name</th>
                      <th style="border: 1px solid #ddd; padding: 5px; text-align: left;">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${u?.members
                      .map(
                        (m) => `
                          <tr>
                            <td style="border: 1px solid #eee; padding: 5px; text-align: left;">${m.username}</td>
                            <td style="border: 1px solid #eee; padding: 5px; text-align: left;">${m.email}</td>
                          </tr>
                        `
                      )
                      .join("")}
                  </tbody>
                </table>
              `;
  
              return `
                <tr>
                  <td style="border: 1px solid #ccc; padding: 10px;">${u?.name}</td>
                  <td style="border: 1px solid #ccc; padding: 10px;">${u?.description || ""}</td>
                  <td style="border: 1px solid #ccc; padding: 10px;">${u?.creator_name || ""}</td>
                  <td style="border: 1px solid #ccc; padding: 10px;">${membersTable}</td>
                  <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${u?.is_active == 1 ? "Active" : "Inactive"}</td>
                  <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${u?.created_at || ""}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  };
  
  export const generateEventParticipant = (viewModalData,eventinfo) => {
  
    return `
    <h2 style="text-align:center"><b>All Event  Participants</b></h2>
    <h3 style = "padding-left:8px"><b>Event Name</b>: ${eventinfo?.title}</h3>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 12px; margin-top: 10px;">
        <thead>
          <tr style="background-color: #e9ecef;">
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">user Name</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">First Name</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Last Name</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Email</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Contact</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Authenticate</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Role</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">User Status</th>
            <th style="border: 1px solid #ccc; padding: 10px; text-align: center;">Event Status</th>
         
          </tr>
        </thead>
        <tbody>
            ${viewModalData
            .map(
              (u) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                 
                  <span>${u?.username}</span>
                </div>
              </td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.first_name || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.last_name || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.email || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.phone || ""}</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${u?.authrization_code || ""}</td>
              <td className="px-4 py-2 capitalize">
           
           ${u?.role_id === 4
              ? "Youth Member"
              : u?.role_id === 5
              ? "Scout"
              : u?.role_id === 6
              ? "Teacher"
              : ""}
          </td>
  
 <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${u?.is_active == 1 ? "Active" : "Inactive"}</td>
  
 <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">${u?.status}</td>

            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };
  