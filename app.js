import {SUPABASE_URL, SUPABASE_KEY} from "./config.js";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const appContainer = document.getElementById('app');
const createForm = document.getElementById('new-destination-form');

// Create a new destination
createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('new-name').value;
    const country = document.getElementById('new-country').value;
    const description = document.getElementById('new-desc').value;
    if (!name || !country) return alert("Name and Country are required");

    try {
        const {error} = await supabase.from('destinations').insert([{
            name, country, description
        }]);

        if (error) alert(error.message);

        alert(`Successfully created ${name}`);
        createForm.reset();
        loadDestinations()

    } catch (err) {
        alert('Failed to add: ' + err.message);
    }
});

// load list of destinations from database
async function loadDestinations() {
    appContainer.innerHTML = '<div class="loader">Loading...</div>';

    try {
        const {data, error} = await supabase
            .from('destinations')
            .select('*')
            .order('created_at', {ascending: true, desc: 'desc'});

        if (error) throw error;
        appContainer.innerHTML = '';

        if (!data || data.length === 0) {
            appContainer.innerHTML = '<p>No destinations found.</p>';
            return;
        }

        data.forEach((dest) => {
            const card = createDestinationCard(dest);
            appContainer.appendChild(card);
        });

    } catch (err) {
        appContainer.innerHTML = `<p style="color: red">Error loading Destinations. ${err.message}</p>`;
    }
}

function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = `card-${destination.id}`;

    const imgUrl = destination.image_url || 'https://ifdnnqztzdhtowlqijet.supabase.co/storage/v1/object/public/destinations/Screenshot%202026-04-24%20203542.png';

    card.innerHTML = `
        <img src="${imgUrl}" alt="${destination.name}" id="img-${destination.id}">
        
        <div class="info-container" id="info-${destination.id}">
            <h3>${destination.name}, ${destination.country}</h3>
            <p>${destination.description || 'No description'}</p>
        </div>
        
        <div class="edit-container" id="edit-${destination.id}" style="display: none">
           <input type="text" class="edit-input" id="edit-name-${destination.id}" value="${destination.name}" placeholder="Name">
           <input type="text" class="edit-input" id="edit-country-${destination.id}" value="${destination.country}" placeholder="Country">
           <textarea class="edit-input" id="edit-desc-${destination.id}" placeholder="Description">${destination.description || ""}</textarea>
        </div> 
                        
        <div class="actions">
            <button class="btn-edit" onclick="window.toggleEditMode('${destination.id}')">Edit Info</button>
            
            <div id="save-actions-${destination.id}" style="display: none">
                <button class="btn-save" onclick="window.saveChanges('${destination.id}')">Save</button>
                <button class="btn-cancel" onclick="window.toggleEditMode('${destination.id}')">Cancel</button>
            </div>
        
            <input type="file" id="file-${destination.id}" accept="image/*" style="display: none">
            <label for="file-${destination.id}" class="btn-update">Change Image</label>
            
            <button class="btn-delete" onclick="window.deleteDestination('${destination.id}')">Delete</button>
            <span class="status" id="status-${destination.id}"></span>
        </div>
    `;

    const fileInput = card.querySelector(`#file-${destination.id}`);
    fileInput.addEventListener('change', () => updateImage(destination.id));

    return card;
}

window.toggleEditMode = function (destinationId) {
    const infoDiv = document.getElementById(`info-${destinationId}`);
    const editDiv = document.getElementById(`edit-${destinationId}`);
    const editBtn = document.querySelector(`#card-${destinationId} .btn-edit`);
    const saveActions = document.getElementById(`save-actions-${destinationId}`);

    if (editDiv.style.display === 'none') {
        infoDiv.style.display = 'none';
        editDiv.style.display = 'block';
        editBtn.style.display = 'none';
        saveActions.style.display = 'flex';
        saveActions.style.gap = '10px';
    }else{
        infoDiv.style.display = 'block';
        editDiv.style.display = 'none';
        editBtn.style.display = 'inline-block';
        saveActions.style.display = 'none';
    }
}

window.saveChanges = async function (destinationId){
    const name = document.getElementById(`edit-name-${destinationId}`).value;
    const country = document.getElementById(`edit-country-${destinationId}`).value;
    const description = document.getElementById(`edit-desc-${destinationId}`).value;
    const statusMessage = document.getElementById(`status-${destinationId}`);

    if (!name || !country) {
        alert(`Name and Country are required`);
        return;
    }

    try {
        statusMessage.textContent = 'Saving..';

        const { error } = await supabase.from('destinations').update({name, country, description}).eq('id', destinationId);

        if (error) alert(error.message);

        const infoDiv = document.getElementById(`info-${destinationId}`);
        infoDiv.innerHTML = `
            <h3>${name}, ${country}</h3>
            <p>${description || 'No description'}</p>
        `;

        window.toggleEditMode(destinationId);

        statusMessage.textContent = 'Saved!';
        setTimeout(() => statusMessage.style.display = 'none', 1500);

    }catch(err) {
        alert('Failed to save: ' + err.message);
        statusMessage.style.display = 'none'
    }
}

window.deleteDestination = async function (destinationId) {
    if (!confirm(`Are you sure you want to delete?`)) return;

    try{
        const {data} = await supabase.from('destinations').select('image_url').eq('id', destinationId).single();
        if (data?.image_url) {
            const pathParts = data.image_url.split('/storage/v1/object/public/');
            if (pathParts.length > 1) await supabase.storage.from('destinations').remove([pathParts[1]]);
        }

        const { error } = await supabase.from('destinations').delete().eq('id', destinationId);

        if (error) alert(error.message);
        loadDestinations()

    }catch(err) {
        alert('Failed to delete: ' + err.message);
    }
};

async function updateImage(destinationId) {
    const fileInput = document.getElementById(`file-${destinationId}`);
    const imgElement = document.getElementById(`img-${destinationId}`);
    const statusMessage = document.getElementById(`status-${destinationId}`);

    if (!fileInput.files.length) return;

    const file = fileInput.files[0];

    if (!file.type.startsWith('image/')) {
        alert(`Please upload an image file!`);
        return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${destinationId}_${Date.now()}.${fileExt}`;

    try {
        statusMessage.textContent = 'Uploading..';

        const { error: uploadError } = await supabase.storage
            .from('destinations')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError){
            console.log(uploadError.message);
            throw uploadError;
        }

        const {data: urlData} = supabase.storage
            .from('destinations')
            .getPublicUrl(fileName);

        if (!urlData || !urlData.publicUrl) {
            throw new Error('Failed to get public URL');
        }

        const publicUrl = urlData.publicUrl;

        const { error: dbError } = await supabase
            .from('destinations')
            .update({ image_url: publicUrl })
            .eq('id', destinationId);

        if (dbError) throw dbError;

        imgElement.src = publicUrl + '?t=' + Date.now();
        statusMessage.textContent = 'Updated!';

        setTimeout(() => statusMessage.style.display = 'none', 1500);

    } catch (err) {
        console.error(err);
        statusMessage.textContent = 'Failed!';
        alert('Failed updating image: ' + err.message);
    }
}

window.generateWithAI = async function () {
  const name = document.getElementById('new-name').value;
  const country = document.getElementById('new-country').value;

  if (!name || !country) return alert(`Name and Country are required`);

  const btn = document.getElementById('ai-btn');
  btn.textContent = 'Generating..';
  btn.disabled = true;

  try {
      const description = await callAIGenerator(name,'Adventure', country);

      document.getElementById('new-desc').value = description;
  }catch(err) {
      alert('Failed to generate new name' + err.message);
  } finally {
      btn.textContent = 'Generate with AI (description)';
      btn.disabled = false;
  }
};

async function callAIGenerator(destinationName, category, country) {
    const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-desc`;
    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },

            body: JSON.stringify({
                destinationName: destinationName,
                category: category,
                country: country,
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Server Response: ', error);
            throw new Error(`HTTP Error ${response.status}: ${error}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'AI Generator Error');
        }

        return result.description;
    }catch(err) {
        console.error('AI Call Failed: ' , err);
        alert('Failed AI Call: ' + err.message);
    }
}

// Tab switching 
 
let reviewsLoaded = false; 
 
window.switchTab = function (tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    event.target.classList.add('active');
    if (tabName === 'reviews' && !reviewsLoaded) {
        reviewsLoaded = true;
        loadAllReviews();
    }
};
 
// Load ALL reviews
 
async function loadAllReviews() {
    const reviewsApp = document.getElementById('reviews-app');
    reviewsApp.innerHTML = '<div class="loader">Loading reviews...</div>';
 
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                booking!inner(
                    tour_id,
                    tours!inner(
                        title,
                        destinations(name, country)
                    )
                )
            `)
            .order('created_at', { ascending: false });
 
        if (error) throw error;
 
        reviewsApp.innerHTML = '';
 
        if (!data || data.length === 0) {
            reviewsApp.innerHTML = '<p>No reviews found.</p>';
            return;
        }
 
        data.forEach((review) => {
            const card = createReviewCard(review);
            reviewsApp.appendChild(card);
        });
 
    } catch (err) {
        reviewsApp.innerHTML = `<p style="color:red">Failed to load reviews: ${err.message}</p>`;
    }
}
 
function createReviewCard(review) {
    const card = document.createElement('div');
    card.classList.add('card', 'review-card');
    card.id = `review-${review.id}`;
 
    const tour = review.booking?.tours;
    const dest = tour?.destinations;
    const destLabel = dest ? `${dest.name}, ${dest.country}` : 'Unknown Destination';
    const tourTitle = tour?.title || 'Unknown Tour';
 
    card.innerHTML = `
        <div class="info-container">
            <p class="review-destination-label">📍 ${destLabel}</p>
            <p class="review-tour-label">🗺️ Tour: ${tourTitle}</p>
            <p class="review-rating">⭐ Rating: ${review.rating ?? 'N/A'}</p>
            <p class="review-text">"${review.comment || 'No comment'}"</p>
            <small style="color:#888">${new Date(review.created_at).toLocaleDateString('vi-VN')}</small>
        </div>
 
        <div class="review-summary-container" id="summary-container-${review.id}">
            ${review.summary
                ? `<p class="review-summary"><strong>🤖 AI Summary:</strong> ${review.summary}</p>`
                : '<p class="review-summary no-summary">No AI summary yet.</p>'
            }
        </div>
 
        <div class="actions">
            <button
                class="btn-edit btn-generate-review-ai"
                id="ai-review-btn-${review.id}"
                onclick="window.generateReviewSummary('${review.id}', this, \`${(review.comment || '').replace(/`/g, "'")}\`)"
            >
                ✨ Generate with AI
            </button>
            <span class="status" id="review-status-${review.id}"></span>
        </div>
    `;
 
    return card;
}
 
// Generate AI summary & save to DB 
 
window.generateReviewSummary = async function (reviewId, btnEl, reviewText) {
    const summaryContainer = document.getElementById(`summary-container-${reviewId}`);
    const statusEl = document.getElementById(`review-status-${reviewId}`);
 
    if (!reviewText || reviewText === 'No comment') {
        alert('This review has no text to summarize.');
        return;
    }
 
    // fetch()
    btnEl.disabled = true;
    btnEl.textContent = 'Generating...';
    statusEl.textContent = '';
 
    try {
        const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-review-summary`;
 
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify({
                review_id: reviewId,
                reviewText: reviewText
            })
        });
 
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
 
        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Edge Function error');
 
        const summary = result.summary;
 
        // Update UI
        summaryContainer.innerHTML = `<p class="review-summary"><strong>🤖 AI Summary:</strong> ${summary}</p>`;
 
        // Store to DB
        const { error: dbError } = await supabase
            .from('reviews')
            .update({ summary: summary })
            .eq('id', reviewId);
 
        if (dbError) throw new Error(`DB update failed: ${dbError.message}`);
 
        statusEl.textContent = '✓ Saved!';
        setTimeout(() => { statusEl.textContent = ''; }, 2000);
 
    } catch (err) {
        console.error(err);
        statusEl.textContent = '✗ Failed';
        alert('Failed to generate summary: ' + err.message);
    } finally {
        btnEl.disabled = false;
        btnEl.textContent = '✨ Generate with AI';
    }
};

loadDestinations();