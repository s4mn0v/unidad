<template>
    <div class="container mx-auto p-4">
        <h1
            class="mb-6 text-4xl font-extrabold leading-none tracking-tight text-black md:text-5xl lg:text-6xl dark:text-white">
            Registros Estudiantes Egresados
        </h1>

        <div class="mb-4 flex justify-between items-center">
            <div class="flex items-center">
                <label for="entries-select" class="mr-2 dark:text-white">Show entries:</label>
                <select id="entries-select" v-model="entriesPerPage"
                    class="px-2 py-1 rounded cursor-pointer dark:bg-dark hover:border-gold dark:text-white focus-within:">
                    <option v-for="option in [5, 10, 25, 50, 100]" :key="option" :value="option">{{ option }}</option>
                </select>
            </div>
            <div class="relative">
                <input type="text" v-model="searchQuery"
                    class="p-2 pl-8 focus:outline-none rounded dark:bg-dark dark:text-white" placeholder="Search...">
                <svg class="w-4 h-4 absolute left-2 top-3 text-gray-500" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
        </div>

        <div class="overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead
                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark dark:border-b-2 dark:border-gold dark:text-gray-400">
                    <tr>
                        <th v-for="column in columns" :key="column.key" @click="sortBy(column.key)"
                            class="px-6 py-3 cursor-pointer">
                            <div class="flex items-center justify-start space-x-2">
                                <span>{{ column.label }}</span>
                                <span v-if="sortColumn === column.key">
                                    <svg v-if="sortOrder === 'asc'" class="w-4 h-4 text-gray-800 dark:text-white"
                                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="m5 15 7-7 7 7" />
                                    </svg>
                                    <svg v-else class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="m19 9-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="company in paginatedCompanies" :key="company.ticker"
                        class="bg-dark border-b dark:bg-dark dark:border-gray-700">
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{
                            company.name }}</td>
                        <td class="px-6 py-4">{{ company.ticker }}</td>
                        <td class="px-6 py-4">{{ company.price }}</td>
                        <td class="px-6 py-4">{{ company.marketCap }}</td>
                    </tr>
                </tbody>

            </table>
        </div>

        <div class="mt-4 flex justify-between items-center dark:text-white">
            <div>
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredCompanies.length }} entries
            </div>
            <div>
                <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 rounded mr-2 dark:bg-dark">&lt;
                    Previous</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded dark:bg-dark">Next
                    &gt;</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: '',
            companies: [
                { name: 'Apple Inc.', ticker: 'AAPL', price: '$192.58', marketCap: '$3.04T' },
                { name: 'Microsoft Corporation', ticker: 'MSFT', price: '$340.54', marketCap: '$2.56T' },
                { name: 'Alphabet Inc.', ticker: 'GOOGL', price: '$134.12', marketCap: '$1.72T' },
                { name: 'Amazon.com Inc.', ticker: 'AMZN', price: '$138.01', marketCap: '$1.42T' },
                { name: 'NVIDIA Corporation', ticker: 'NVDA', price: '$466.19', marketCap: '$1.16T' },
                { name: 'Tesla Inc.', ticker: 'TSLA', price: '$255.98', marketCap: '$811.00B' },
                { name: 'Meta Platforms Inc.', ticker: 'META', price: '$311.71', marketCap: '$816.00B' },
                { name: 'Berkshire Hathaway Inc.', ticker: 'BRK.B', price: '$354.08', marketCap: '$783.00B' },
            ],
            columns: [
                { key: 'name', label: 'Company Name' },
                { key: 'ticker', label: 'Ticker' },
                { key: 'price', label: 'Stock Price' },
                { key: 'marketCap', label: 'Market Capitalization' },
            ],
            sortColumn: 'name',
            sortOrder: 'asc',
            currentPage: 1,
            entriesPerPage: 5,
        };
    },
    computed: {
        filteredCompanies() {
            let filtered = this.companies.filter(company => {
                const query = this.searchQuery.toLowerCase();
                return Object.values(company).some(value =>
                    value.toString().toLowerCase().includes(query)
                );
            });

            filtered.sort((a, b) => {
                let modifier = this.sortOrder === 'asc' ? 1 : -1;
                if (a[this.sortColumn] < b[this.sortColumn]) return -1 * modifier;
                if (a[this.sortColumn] > b[this.sortColumn]) return 1 * modifier;
                return 0;
            });

            return filtered;
        },
        paginatedCompanies() {
            const start = (this.currentPage - 1) * this.entriesPerPage;
            const end = start + this.entriesPerPage;
            return this.filteredCompanies.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredCompanies.length / this.entriesPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.entriesPerPage;
        },
        endIndex() {
            return Math.min(this.startIndex + this.entriesPerPage, this.filteredCompanies.length);
        },
    },
    methods: {
        sortBy(column) {
            if (this.sortColumn === column) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortOrder = 'asc';
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
    },
    watch: {
        entriesPerPage() {
            this.currentPage = 1;
        },
        searchQuery() {
            this.currentPage = 1;
        },
    },
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>