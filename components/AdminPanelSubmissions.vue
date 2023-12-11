<template>
    <div class="mx-8">
        <h1>Submissions</h1>
        <div class="flex flex-row mt-8">
            <section>
                <h2>Original submission</h2>
                <div>
                    <span>ID:</span>
                    <span> some ID</span>
                </div>
                <div>
                    <span>Created date:</span>
                    <span> some date</span>
                </div>
                <div>
                    <span>Google maps URL:</span>
                    <span> some URL</span>
                </div>
                <div>
                    <span>Healthcare professional name:</span>
                    <span> some name</span>
                </div>
                <div>
                    <span>Is Approved:</span>
                    <span> False</span>
                </div>
                <div>
                    <span>Is Rejected:</span>
                    <span> False</span>
                </div>
                <div>
                    <span>Is Under Review:</span>
                    <span> True</span>
                </div>
                <div>
                    <span>Notes:</span>
                    <span> some notes</span>
                </div>
                <div>
                    <span>Spoken languages:</span>
                    <span> some language 1 , some language 2</span>
                </div>
                <div>
                    <span>Updated date:</span>
                    <span> some date</span>
                </div>
            </section>
            <div class="mx-8">
                <section>
                    <h2>Facility Input</h2>
                    <div class="flex flex-col">
                        <div>
                            <span>ID:</span>
                            <span> some ID</span>
                        </div>
                        <label>facility name en</label>
                        <input type="text" />
                        <label>address line 1 en</label>
                        <input type="text" />
                        <label>address line 2 en</label>
                        <input type="text" />
                        <label>city en</label>
                        <input type="text" />
                        <label>prefecture en</label>
                        <input type="text" />
                        <label>facility name ja</label>
                        <input type="text" />
                        <label>address line 1 ja</label>
                        <input type="text" />
                        <label>address line 1 ja</label>
                        <input type="text" />
                        <label>city ja</label>
                        <input type="text" />
                        <label>prefecture ja</label>
                        <input type="text" />
                        <label>postal code</label>
                        <input type="text" />
                        <label>email address</label>
                        <input type="text" />
                        <label>phone number</label>
                        <input type="text" />
                        <label>google maps url</label>
                        <input type="text" />
                        <label>website url</label>
                        <input type="text" />
                        <label>map latitude</label>
                        <input type="text" />
                        <label>map longitude</label>
                        <input type="text" />
                        <label>healthcare professional Ids</label>
                        <input type="text" disabled />
                        <label>created date</label>
                        <input type="text" disabled />
                        <label>updated date</label>
                        <input type="text" disabled />
                        <button>Save Facility</button>
                    </div>
                </section>
                <section class="mt-8">
                    <h2>Healthcare Professional Input</h2>
                    <div>
                        <span>ID:</span>
                        <span> some ID</span>
                    </div>
                    <div class="flex flex-col">
                        <!-- change to select -->
                        <label>accepted insurance</label>
                        <input type="text" />
                        <label>degrees</label>
                        <input type="text" />
                        <label>created date</label>
                        <input type="text" disabled />
                        <label>facility ids</label>
                        <input type="text" />
                        <!-- add locale btn -->
                        <label>first name</label>
                        <input type="text" />
                        <label>last name</label>
                        <input type="text" />
                        <label>locale</label>
                        <input type="text" />
                        <label>specialties</label>
                        <input type="text" />
                        <!-- change to select -->
                        <label>spoken languages</label>
                        <input type="text" />
                        <label>created date</label>
                        <input type="text" disabled />
                        <label>updated date</label>
                        <input type="text" disabled />
                        <button>Save Healthcare Professional</button>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>
